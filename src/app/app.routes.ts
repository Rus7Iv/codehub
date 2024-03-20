import { Routes } from '@angular/router';
import { RepositoryListComponent } from './repository-list/repository-list.component';
import { RepositoryDetailComponent } from './repository-detail/repository-detail.component';

export const routes: Routes = [
  { path: '', component: RepositoryListComponent },
  { path: 'repository/:id', component: RepositoryDetailComponent }
];
