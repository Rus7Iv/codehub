// repository-list.component.ts
import { Component, OnInit } from '@angular/core';
import { IRepository } from '../repository-detail/repository-detail.component';
import { GithubService } from '../../services/github.service';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-repository-list',
  templateUrl: './repository-list.component.html',
  styleUrls: ['./repository-list.component.scss']
})
export class RepositoryListComponent implements OnInit {
  repositories: IRepository[] = [];
  searchControl = new FormControl();
  selectedLanguage: string;

  constructor(private githubService: GithubService) {
    this.selectedLanguage = '';
  }

  ngOnInit(): void {
    this.githubService.getRepositories().subscribe((data: IRepository[]) => {
      this.repositories = data;
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.githubService.searchRepositories(searchTerm, this.selectedLanguage).subscribe((data: IRepository[]) => {
        this.repositories = data;
      });
    });
  }

  onLanguageSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedLanguage = selectElement.value;
    this.githubService.searchRepositories(this.searchControl.value, this.selectedLanguage).subscribe((data: IRepository[]) => {
      this.repositories = data;
    });
  }
}
