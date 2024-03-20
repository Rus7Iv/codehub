import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, of, switchMap } from 'rxjs';
import { ICommit, IContentResponse, IFile, IRepository } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  constructor(private http: HttpClient) { }

  getRepositories() {
    return this.http.get<IRepository[]>('https://api.github.com/repositories');
  }

  getRepository(id: string) {
    return this.http.get<IRepository>(`https://api.github.com/repositories/${id}`);
  }

  getCommits(repo: string) {
    return this.http.get<ICommit[]>(`https://api.github.com/repos/${repo}/commits`);
  }

  getReadme(id: string) {
    return this.http.get<IFile[]>(`https://api.github.com/repositories/${id}/contents`).pipe(
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
    );
  }
}
