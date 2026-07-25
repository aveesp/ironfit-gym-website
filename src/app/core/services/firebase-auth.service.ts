import { Injectable, signal, computed } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup,
  updateProfile, User,
} from 'firebase/auth';
import { environment } from '../../../environments/environment';
import { RequestableRole, UserProfile, UserRole, UserStatus } from '../models';

const app = initializeApp(environment.firebase);
const firebaseAuth = getAuth(app);

@Injectable({ providedIn: 'root' })
export class FirebaseAuthService {
  currentUser = signal<User | null>(null);
  role = signal<UserRole | null>(null);
  status = signal<UserStatus | null>(null);
  /** True until Firebase has restored (or ruled out) a persisted session. */
  loading = signal(true);

  isLoggedIn = computed(() => !!this.currentUser());
  isAdmin = computed(() => this.role() === 'admin');
  isOwner = computed(() => this.role() === 'owner');
  /** An owner can only act once an admin has approved the account. */
  isApprovedOwner = computed(() => this.isOwner() && this.status() === 'active');
  isPendingOwner = computed(() => this.isOwner() && this.status() === 'pending');
  isRejectedOwner = computed(() => this.isOwner() && this.status() === 'rejected');

  displayName = computed(() =>
    this.currentUser()?.displayName || this.currentUser()?.email?.split('@')[0] || 'Member');

  constructor() {
    onAuthStateChanged(firebaseAuth, async user => {
      this.currentUser.set(user);
      if (user) {
        await this.loadClaims(user);
      } else {
        this.role.set(null);
        this.status.set(null);
      }
      this.loading.set(false);
    });
  }

  /**
   * Roles live in the ID token's custom claims, which only the backend can set.
   * Reading them here drives the UI only — the API re-verifies every request.
   */
  private async loadClaims(user: User, forceRefresh = false) {
    try {
      const token = await user.getIdTokenResult(forceRefresh);
      this.role.set((token.claims['role'] as UserRole) ?? 'user');
      this.status.set((token.claims['status'] as UserStatus) ?? 'active');
    } catch {
      this.role.set('user');
      this.status.set('active');
    }
  }

  /**
   * Claims are baked into the ID token, so a role change an admin just made is
   * invisible until the token is refreshed. Call this after any role change.
   */
  async refreshClaims() {
    const user = this.currentUser();
    if (user) await this.loadClaims(user, true);
  }

  async loginWithEmail(email: string, password: string) {
    return signInWithEmailAndPassword(firebaseAuth, email, password);
  }

  async registerWithEmail(
    email: string,
    password: string,
    displayName = '',
    requestedRole: RequestableRole = 'user',
  ) {
    const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    if (displayName) await updateProfile(cred.user, { displayName });
    await this.provisionProfile(displayName, requestedRole);
    return cred;
  }

  async loginWithGoogle(requestedRole: RequestableRole = 'user') {
    const cred = await signInWithPopup(firebaseAuth, new GoogleAuthProvider());
    await this.provisionProfile(cred.user.displayName ?? '', requestedRole);
    return cred;
  }

  /**
   * Asks the API to create the Firestore profile and grant the role claims.
   *
   * Uses fetch rather than ApiService because ApiService depends on this service
   * for its auth token, and injecting it here would be circular.
   */
  private async provisionProfile(displayName: string, requestedRole: RequestableRole) {
    const token = await this.getIdToken();
    if (!token) return;
    try {
      await fetch(`${environment.apiUrl}/auth/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ displayName, requestedRole }),
      });
      // Pick up whatever role the server actually granted.
      await this.refreshClaims();
    } catch {
      // Best effort: the account exists either way and defaults to 'user'
      // until /auth/me back-fills the profile on next load.
    }
  }

  /** Full profile from the API (Firestore), for the dashboards. */
  async fetchProfile(): Promise<UserProfile | null> {
    const token = await this.getIdToken();
    if (!token) return null;
    try {
      const res = await fetch(`${environment.apiUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.ok ? await res.json() : null;
    } catch {
      return null;
    }
  }

  async logout() {
    return signOut(firebaseAuth);
  }

  async getIdToken(): Promise<string | null> {
    const user = this.currentUser();
    if (!user) return null;
    return user.getIdToken();
  }
}
