import { Injectable, Optional } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseAuthService } from './firebase-auth.service';
import { Router } from '@angular/router';
import { map, tap, switchMap, flatMap } from 'rxjs/operators';
import { Observable, combineLatest, of, merge } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../../model/user';
import { ChatBaseService } from '../chat-base.service';
import { Message } from '../../model/message';
import { Chat } from '../../model/chat';
import { ServicesConfig } from '../services-config';
import * as moment from 'moment';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseChatService extends ChatBaseService {
  userDictionary = {};

  constructor(
    private afs: AngularFirestore,
    private auth: FirebaseAuthService,
    private router: Router,
    @Optional() config?: ServicesConfig
  ) {
    super(config);
  }

  getHistory(chatId: string): Observable<any> {
    return this.afs
      .collection<Chat>('chats')
      .doc(chatId)
      .snapshotChanges()
      .pipe(
        map(doc => {
          const data: any = doc.payload.data();
          return { id: doc.payload.id, ...data };
        })
      );
  }

  getParticipatingChats() {
    return this.auth.user$.pipe(
      switchMap(user => {
        const participatingChats = this.afs
          .collection('chats', ref =>
            ref.where('participants', 'array-contains', user.uid)
          )
          .snapshotChanges();
        return participatingChats.pipe(
          map(actions => {
            return actions.map(a => {
              const chatData: any = a.payload.doc.data();
              const id = a.payload.doc.id;
              return { id, ...chatData };
            });
          })
        );
      })
    );
  }

  async create(): Promise<boolean> {
    // Fetch user and wait for result
    const { uid } = await this.auth.getUser();

    // Init new chat data
    const data: Chat = {
      createdAt: firebase.firestore.Timestamp.now(),
      count: 0,
      messages: [],
      participants: [uid],
      ownerId: uid,
      typing: []
    };

    // Add new chat data to firestore and wait for result
    const docRef = await this.afs.collection('chats').add(data);

    // Route to new chat in chat component
    return this.router.navigate(['chats', docRef.id]);
  }

  async sendIsTyping(chatId: string): Promise<void> {
    const { uid } = await this.auth.getUser();

    if (uid) {
      const ref = this.afs.collection('chats').doc(chatId);
      return ref.update({
        typing: firebase.firestore.FieldValue.arrayUnion(uid)
      });
    }
  }

  async deleteIsTyping(chatId: string): Promise<void> {
    const { uid } = await this.auth.getUser();

    if (uid) {
      const ref = this.afs.collection('chats').doc(chatId);
      return ref.update({
        typing: firebase.firestore.FieldValue.arrayRemove(uid)
      });
    }
  }

  async sendMessage(chatId: string, content: string): Promise<void> {
    const { uid } = await this.auth.getUser();

    const data = {
      uid,
      content,
      createdAt: firebase.firestore.Timestamp.now()
    };

    if (uid) {
      const ref = this.afs.collection('chats').doc(chatId);
      return ref.update({
        messages: firebase.firestore.FieldValue.arrayUnion(data)
      });
    }
  }

  async deleteMessage(chat: Chat, msg: Message) {
    const { uid } = await this.auth.getUser();

    const ref = this.afs.collection('chats').doc(chat.id);
    if (chat.uid === uid || msg.uid === uid) {
      delete msg.user;
      return ref.update({
        messages: firebase.firestore.FieldValue.arrayRemove(msg)
      });
    }
  }

  buildChat(chat$: Observable<any>): Observable<any> {
    let chat: any;

    return chat$.pipe(
      switchMap(c => {
        chat = c;
        // Get all users in the chat -> find user data since only uid is known
        const uids = Array.from(
          new Set(c.messages.map((message: any) => message.uid))
        );
        const users = this.fetchUsers(uids);
        return users.length ? combineLatest(users) : of([]);
      }),
      map(users => {
        this.buildUserDictionary(users);
        // Augment message data with newly fetched user data
        chat.messages = chat.messages.map((message: any) => {
          return {
            ...message,
            createdAt: moment(message.createdAt.toDate()),
            user: this.userDictionary[message.uid]
          };
        });
        return chat;
      })
    );
  }

  private buildUserDictionary(users: unknown[]) {
    users.forEach(user => (this.userDictionary[(user as User).uid] = user));
  }

  private fetchUsers(uids: unknown[]): Observable<any>[] {
    return uids.map(uid => this.afs.doc(`users/${uid}`).valueChanges());
  }

  getUserById(typerId) {
    return this.userDictionary[typerId];
  }
}
