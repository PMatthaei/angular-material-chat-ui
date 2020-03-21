import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule, StorageBucket } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { ChatComponent } from './chat/chat.component';
import { HomeComponent } from './home/home.component';
import { environment } from '../environments/environment';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatProgressBarModule,
  MatChipsModule,
  MatFormFieldModule,
  MatInputModule,
  MatListModule,
  MatTooltipModule
} from '@angular/material';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatRippleModule } from '@angular/material/core';
import { ChatMessageComponent } from './chat/chat-message/chat-message.component';
import { TypingIndicatorComponent } from './chat/typing-indicator/typing-indicator.component';
import { ChatControlsComponent } from './chat/chat-controls/chat-controls.component';
import { ChatHeaderComponent } from './chat/chat-header/chat-header.component';
import { ServicesModule } from './services/services.module';
import { ChatBaseService } from './services/chat-base.service';
import { FirebaseChatService } from './services/firebase/firebase-chat.service';

const config = {
  firebase: {
    chat: 'test'
  },
  apiEndpoints: {
    history: 'test'
  }
};

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    HomeComponent,
    ChatMessageComponent,
    TypingIndicatorComponent,
    ChatControlsComponent,
    ChatHeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatRippleModule,
    MatToolbarModule,
    MatTooltipModule,
    MatListModule,
    MatProgressBarModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    FlexLayoutModule,
    AngularFireStorageModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ServicesModule.forRoot(config)
  ],
  providers: [FirebaseChatService],
  bootstrap: [AppComponent]
})
export class AppModule {}
