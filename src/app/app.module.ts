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
import { ArrayFilterUidPipe } from './array-filter-uid.pipe';
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

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    HomeComponent,
    ArrayFilterUidPipe,
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
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
