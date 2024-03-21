import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, map, of, switchMap } from 'rxjs';
import { IGithubSearchResponse, ICommit, IContentResponse, IFile, IRepository } from '../interfaces';

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

  searchRepositories(searchTerm: string, language: string) {
    let queryString = searchTerm;
    if (language) {
      queryString += `+language:${encodeURIComponent(language)}`;
    }
    const params = new HttpParams().set('q', queryString);
    return this.http.get<IGithubSearchResponse>('https://api.github.com/search/repositories', { params }).pipe(
      map(response => response.items)
    );
  }
}
