import { Component } from '@angular/core';
import { FirebaseAuthService } from './services/firebase/firebase-auth.service';
import { FirebaseChatService } from './services/firebase/firebase-chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public auth: FirebaseAuthService, public cs: FirebaseChatService) {}
}
