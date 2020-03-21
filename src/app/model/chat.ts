import * as firebase from 'firebase';
import { Message } from './message';

export interface Chat {
  id?: string;
  uid?: string;
  createdAt: firebase.firestore.Timestamp;
  count: number;
  messages: Message[];
  participants: string[];
  ownerId: string;
  typing: string[];
}
