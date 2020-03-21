import { User } from './User';

export interface Attachment {
  name: string;
}

export interface Message {
  content: string;
  uid: string;
  createdAt: number;
  user: User;
  attachments: Attachment[];
}
