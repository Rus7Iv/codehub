// repository-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IRepository } from '../repository-list/repository-list.component';

interface IContentResponse {
  content: string;
}

interface IFile {
  name: string;
  url: string;
}

@Component({
  selector: 'app-repository-detail',
  templateUrl: './repository-detail.component.html',
  styleUrls: ['./repository-detail.component.scss']
})
export class RepositoryDetailComponent implements OnInit {
  repository: IRepository | null = null;
  readme: SafeHtml | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.http.get<IRepository>(`https://api.github.com/repositories/${id}`).subscribe((data: IRepository) => {
      this.repository = data;
    });

    this.http.get<IFile[]>(`https://api.github.com/repositories/${id}/contents`).pipe(
      switchMap((files: IFile[]) => {
        const readmeFile = files.find(file => file.name.toLowerCase() === 'readme.md');
        if (readmeFile) {
          return this.http.get<IContentResponse>(readmeFile.url);
        } else {
          console.log('Файл README не найден');
          return of({ content: '' });
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.log('Ошибка при получении файла README:', error.message);
        return of({ content: '' });
      })
    ).subscribe((data: IContentResponse) => {
      this.readme = this.sanitizer.bypassSecurityTrustHtml(atob(data.content));
    });
  }
}
