import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchStateService {
  private searchTerm = new BehaviorSubject<string>('');
  private selectedLanguage = new BehaviorSubject<string>('');

  setSearchTerm(term: string) {
    this.searchTerm.next(term);
  }

  getSearchTerm() {
    return this.searchTerm.asObservable();
  }

  setSelectedLanguage(language: string) {
    this.selectedLanguage.next(language);
  }

  getSelectedLanguage() {
    return this.selectedLanguage.asObservable();
  }
}
