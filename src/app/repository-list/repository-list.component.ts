import { Component, OnInit } from '@angular/core';
import { IRepository } from '../repository-detail/repository-detail.component';
import { GithubService } from '../../services/github.service';

@Component({
  selector: 'app-repository-list',
  templateUrl: './repository-list.component.html',
  styleUrls: ['./repository-list.component.scss']
})
export class RepositoryListComponent implements OnInit {
  repositories: IRepository[] = [];

  constructor(private githubService: GithubService) { }

  ngOnInit(): void {
    this.githubService.getRepositories().subscribe((data: IRepository[]) => {
      this.repositories = data;
    });
  }
}
