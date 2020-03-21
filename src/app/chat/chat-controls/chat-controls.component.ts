import { Component, Input, OnInit } from '@angular/core';
import { AttachmentService } from '../../services/attachment.service';
import { ChatService } from '../../services/chat.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, filter, throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-chat-controls',
  templateUrl: './chat-controls.component.html',
  styleUrls: ['./chat-controls.component.scss']
})
export class ChatControlsComponent implements OnInit {
  @Input() chatId: string;

  messageControl: FormControl;
  chatForm: FormGroup;

  constructor(private attachmentService: AttachmentService, private chatService: ChatService, private fb: FormBuilder) {
    this.messageControl = new FormControl();
    this.chatForm = this.fb.group({ message: this.messageControl });
  }

  ngOnInit() {
    this.scrollBottom();

    this.messageControl.valueChanges
      .pipe(
        filter(data => data !== ''),
        throttleTime(1400)
      )
      .subscribe(data => {
        this.chatService.sendIsTyping(this.chatId);
      });

    this.messageControl.valueChanges
      .pipe(
        filter(data => data !== ''),
        debounceTime(1500)
      )
      .subscribe(data => {
        this.chatService.deleteIsTyping(this.chatId);
      });
  }

  submit(chatId) {
    const msg = this.messageControl.value;
    if (!msg) {
      return alert('Please enter a message.');
    }
    this.chatService.sendMessage(chatId, msg);
    this.attachmentService.uploadAttachments().subscribe(
      res => console.log(res),
      err => console.log(err)
    );
    this.messageControl.reset();
    this.scrollBottom();
  }

  private scrollBottom() {
    setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 500);
  }

  setSelectedFiles(event) {
    this.attachmentService.setSelectedFiles(event);
  }

  deleteAttachment(file) {
    return this.attachmentService.deleteFile(file);
  }

  getAttachments() {
    return this.attachmentService.getFiles();
  }

  hasAttachments() {
    return this.attachmentService.getFiles().length > 0;
  }
}
