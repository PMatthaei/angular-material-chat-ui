import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';

import { Observable, of, combineLatest } from 'rxjs';
import { switchMap, first, map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FirebaseAuthService {
  user$: Observable<any>;

  constructor(
    private angularFireAuth: AngularFireAuth,
    private angularFirestore: AngularFirestore,
    private router: Router
  ) {
    this.user$ = this.angularFireAuth.authState.pipe(
      switchMap((user: firebase.User) => {
        if (user) {
          const publicUserData = this.angularFirestore
            .doc(`users/${user.uid}`)
            .valueChanges();
          const secureUserData = this.angularFirestore
            .doc(`users/${user.uid}`)
            .collection('secureData')
            .valueChanges()
            .pipe(catchError(err => of({})));
          return combineLatest(publicUserData, secureUserData).pipe(
            map(([publicData, secureData]) => ({
              ...(publicData as {}),
              ...secureData[0]
            }))
          );
        } else {
          return of(null);
        }
      })
    );
  }

  getUser() {
    return this.user$.pipe(first()).toPromise();
  }

  googleSignIn() {
    const provider = new auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  private async oAuthLogin(provider) {
    const credential = await this.angularFireAuth.auth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  }

  private updateUserData({ uid, email, displayName, photoURL }) {
    const userRef: AngularFirestoreDocument<any> = this.angularFirestore.doc(`users/${uid}`);

    const data = {
      uid,
      email,
      displayName,
      photoURL
    };

    return userRef.set(data, { merge: true });
  }

  async signOut() {
    await this.angularFireAuth.auth.signOut();
    return this.router.navigate(['/']);
  }
}
