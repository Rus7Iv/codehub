import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GithubService } from '../../services/github.service';
import { ICommit, IContentResponse, IRepository } from '../../interfaces';

@Component({
  selector: 'app-repository-detail',
  templateUrl: './repository-detail.component.html',
  styleUrls: ['./repository-detail.component.scss']
})
export class RepositoryDetailComponent implements OnInit {
  repository: IRepository | null = null;
  readme: SafeHtml | null = null;
  commits: ICommit[] | null = null; // Объявите переменную commits

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private githubService: GithubService // Внедрите сервис
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) { // Проверьте, что id не равно null
      this.githubService.getRepository(id).subscribe((data: IRepository) => {
        this.repository = data;
      });

      this.githubService.getCommits('mojombo/god').subscribe((data: ICommit[]) => {
        this.commits = data;
      });

      this.githubService.getReadme(id).subscribe((data: IContentResponse) => {
        this.readme = this.sanitizer.bypassSecurityTrustHtml(atob(data.content));
      });
    }
  }
}
export { IRepository };

