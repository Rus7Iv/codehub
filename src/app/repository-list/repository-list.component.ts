import { Component, OnInit } from '@angular/core';
import { IRepository } from '../repository-detail/repository-detail.component';
import { GithubService } from '../../services/github.service';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-repository-list',
  templateUrl: './repository-list.component.html',
  styleUrls: ['./repository-list.component.scss']
})
export class RepositoryListComponent implements OnInit {
  repositories: IRepository[] = [];
  searchControl = new FormControl();
  selectedLanguage: string = '';

  constructor(private githubService: GithubService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchControl.setValue(params['searchTerm'] || '');
      this.selectedLanguage = params['language'] || '';
      this.githubService.searchRepositories(this.searchControl.value, this.selectedLanguage).subscribe((data: IRepository[]) => {
        this.repositories = data;
      });
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.updateUrl(searchTerm, this.selectedLanguage);
    });
  }

  onLanguageSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedLanguage = selectElement.value;
    this.updateUrl(this.searchControl.value, this.selectedLanguage);
  }

  updateUrl(searchTerm: string, language: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { searchTerm, language },
      queryParamsHandling: 'merge'
    });
  }
}
