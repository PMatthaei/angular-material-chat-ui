import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, combineLatest } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {
  uploadPercentages: Observable<number>[] = [];
  downloadURL: Observable<string>;

  files: Set<File> = new Set<File>();
  filesAsArray: File[] = [];

  constructor(private storage: AngularFireStorage) {}

  getFiles() {
    return this.filesAsArray;
  }

  uploadAttachments() {
    return combineLatest(
      this.filesAsArray.map((file: File) => this.uploadAttachment(file))
    ).pipe(finalize(() => this.files.clear()));
  }

  uploadAttachment(file: File) {
    const filePath = file.name + '_' + Date.now().toLocaleString();
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.uploadPercentages.push(task.percentageChanges());
    return task
      .snapshotChanges()
      .pipe(finalize(() => fileRef.getDownloadURL()));
  }

  downloadAttachment() {
    const ref = this.storage.ref('users/davideast.jpg');
    return ref.getDownloadURL();
  }

  setSelectedFiles(event) {
    // Prevent same file in same upload
    const selectedFiles = Array.from(event.target.files) as File[];
    selectedFiles.forEach(item => this.files.add(item));
    this.filesAsArray = Array.from(selectedFiles);
  }

  deleteFile(file) {
    this.files.delete(file);
    this.filesAsArray = this.filesAsArray.filter(item => item !== file);
  }

  getUploadPercentages() {
    return this.uploadPercentages;
  }
}
