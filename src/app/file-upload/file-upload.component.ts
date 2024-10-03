import { Component } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { throwError } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css'
})
export class FileUploadComponent {
  status: "initial" | "uploading" | "success" | "Erasing" | "fail" = "initial"; // Variable to store file status
  file: File | null = null; // Variable to store file
  uploadedFile: any; // Variable to store file

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.listFiles();
  }

  listFiles() {

    const bucketList = this.http.get("http://localhost:3000/list");
    bucketList.subscribe(data => {
      this.uploadedFile = data;
    });
  }

  // On file Select
  fileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.status = "initial";
      this.file = file;
    }
  }

  uploadFile() {
    if (this.file) {
      const formData = new FormData();

      formData.append("file", this.file, this.file.name);

      const upload$ = this.http.post("http://localhost:3000/upload", formData);

      this.status = "uploading";

      upload$.subscribe({
        next: () => {
          this.status = "success";
          this.listFiles();
        },
        error: (error: any) => {
          this.status = "fail";
          return throwError(() => error);
        },
      });
    }
  }

  eraseFile(key: string) {

    const options = {
      key: key
    };
    
    const erase$ = this.http.delete("http://localhost:3000/erase/" + key);

    this.status = "Erasing";

    erase$.subscribe({
      next: () => {
        this.status = "success";
        this.listFiles();
      },
      error: (error: any) => {
        this.status = "fail";
        return throwError(() => error);
      },
    });
  }

}
