export interface IOwner {
  login: string;
  avatar_url: string;
}

export interface IContentResponse {
  content: string;
}

export interface IFile {
  name: string;
  url: string;
}

export interface IRepository {
  id: number;
  name: string;
  description: string;
  forks_count: number;
  stargazers_count: number;
  language: string;
  languages: string[];
  owner: IOwner;
}

export interface ICommit {
  sha: string;
  commit: {
    author: {
      name: string;
      date: string;
    };
    message: string;
  };
}

export interface IGithubSearchResponse {
  items: IRepository[];
}

export interface ILanguages {
  value: string;
  viewValue: string;
}
