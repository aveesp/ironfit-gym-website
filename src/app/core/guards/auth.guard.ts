import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, take } from 'rxjs';
import { FirebaseAuthService } from '../services/firebase-auth.service';
import { UserRole } from '../models';

/**
 * Waits for Firebase to restore any persisted session before deciding.
 *
 * Without this the guard would run while `loading` is still true and bounce a
 * signed-in user to /login every time they refreshed a protected page.
 */
function whenAuthReady() {
  const auth = inject(FirebaseAuthService);
  return toObservable(auth.loading).pipe(filter(loading => !loading), take(1));
}

/** Requires a signed-in user of any role. */
export const authGuard: CanActivateFn = () => {
  const auth = inject(FirebaseAuthService);
  const router = inject(Router);

  return whenAuthReady().pipe(
    map(() => auth.isLoggedIn() ? true : router.createUrlTree(['/login'])),
  );
};

/**
 * Requires one of the given roles. Signed-in users with the wrong role are sent
 * to their own dashboard rather than to /login, which would be misleading.
 */
export function roleGuard(allowed: UserRole[]): CanActivateFn {
  return () => {
    const auth = inject(FirebaseAuthService);
    const router = inject(Router);

    return whenAuthReady().pipe(
      map(() => {
        if (!auth.isLoggedIn()) return router.createUrlTree(['/login']);

        const role = auth.role();
        if (!role || !allowed.includes(role)) return router.createUrlTree(['/dashboard']);
        return true;
      }),
    );
  };
}
