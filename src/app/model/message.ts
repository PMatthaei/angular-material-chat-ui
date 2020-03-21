import { User } from './User';
import { Moment } from 'moment';

export interface Attachment {
  name: string;
}

export interface Message {
  content: string;
  uid: string;
  createdAt: Moment;
  user: User;
  attachments: Attachment[];
}
