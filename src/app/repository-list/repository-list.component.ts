import { Component, OnInit } from '@angular/core';
import { IRepository } from '../repository-detail/repository-detail.component';
import { GithubService } from '../../services/github.service';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { languages } from '../../stores/languages';

@Component({
  selector: 'app-repository-list',
  templateUrl: './repository-list.component.html',
  styleUrls: ['./repository-list.component.scss']
})
export class RepositoryListComponent implements OnInit {
  repositories: IRepository[] = [];
  searchControl = new FormControl();
  languageControl = new FormControl();
  languages = languages;

  constructor(private githubService: GithubService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchControl.setValue(params['searchTerm'] || '');
      this.languageControl.setValue(params['language'] || '');
      this.performSearch(this.searchControl.value, this.languageControl.value);
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.updateUrl(searchTerm, this.languageControl.value);
      this.performSearch(searchTerm, this.languageControl.value);
    });

    this.languageControl.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(language => {
      this.updateUrl(this.searchControl.value, language);
      this.performSearch(this.searchControl.value, language);
    });
  }

  updateUrl(searchTerm: string, language: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { searchTerm, language },
      queryParamsHandling: 'merge'
    });
  }

  performSearch(searchTerm: string, language: string): void {
    if (searchTerm.trim() === '' && language.trim() === '') {
      this.githubService.getRepositories().subscribe((data: IRepository[]) => {
        this.repositories = data;
      });
    } else if (searchTerm.trim() !== '' || language.trim() !== '') {
      this.githubService.searchRepositories(searchTerm, language).subscribe((data: IRepository[]) => {
        this.repositories = data;
      });
    }
  }
}
