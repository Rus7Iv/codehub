import { Component, OnInit } from '@angular/core';
import { IRepository } from '../repository-detail/repository-detail.component';
import { GithubService } from '../../services/github.service';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SearchStateService } from '../../services/search-state.service';

@Component({
  selector: 'app-repository-list',
  templateUrl: './repository-list.component.html',
  styleUrls: ['./repository-list.component.scss']
})
export class RepositoryListComponent implements OnInit {
  repositories: IRepository[] = [];
  searchControl = new FormControl();
  selectedLanguage: string = '';

  constructor(private githubService: GithubService, private searchStateService: SearchStateService) { }

  ngOnInit(): void {
    this.searchStateService.getSearchTerm().subscribe(term => {
      this.searchControl.setValue(term);
    });

    this.searchStateService.getSelectedLanguage().subscribe(language => {
      this.selectedLanguage = language;
    });

    this.githubService.getRepositories().subscribe((data: IRepository[]) => {
      this.repositories = data;
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.searchStateService.setSearchTerm(searchTerm);
      this.githubService.searchRepositories(searchTerm, this.selectedLanguage).subscribe((data: IRepository[]) => {
        this.repositories = data;
      });
    });
  }

  onLanguageSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedLanguage = selectElement.value;
    this.searchStateService.setSelectedLanguage(this.selectedLanguage);
    this.githubService.searchRepositories(this.searchControl.value, this.selectedLanguage).subscribe((data: IRepository[]) => {
      this.repositories = data;
    });
  }
}
