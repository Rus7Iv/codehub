import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface IRepository {
  id: number;
  name: string;
  description: string;
}

@Component({
  selector: 'app-repository-list',
  templateUrl: './repository-list.component.html',
  styleUrls: ['./repository-list.component.scss']
})
export class RepositoryListComponent implements OnInit {
  repositories: IRepository[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<IRepository[]>('https://api.github.com/repositories').subscribe((data: IRepository[]) => {
      this.repositories = data;
    });
  }
}
