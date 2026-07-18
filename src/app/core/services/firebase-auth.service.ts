import { Injectable, signal } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup,
  User
} from 'firebase/auth';
import { environment } from '../../../environments/environment';

const app = initializeApp(environment.firebase);
const firebaseAuth = getAuth(app);

@Injectable({ providedIn: 'root' })
export class FirebaseAuthService {
  currentUser = signal<User | null>(null);
  loading = signal(true);

  constructor() {
    onAuthStateChanged(firebaseAuth, user => {
      this.currentUser.set(user);
      this.loading.set(false);
    });
  }

  async loginWithEmail(email: string, password: string) {
    return signInWithEmailAndPassword(firebaseAuth, email, password);
  }

  async registerWithEmail(email: string, password: string) {
    return createUserWithEmailAndPassword(firebaseAuth, email, password);
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(firebaseAuth, provider);
  }

  async logout() {
    return signOut(firebaseAuth);
  }

  async getIdToken(): Promise<string | null> {
    const user = this.currentUser();
    if (!user) return null;
    return user.getIdToken();
  }

  isLoggedIn() {
    return !!this.currentUser();
  }
}
