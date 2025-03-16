export interface CommitActivity {
    week: number; 
    total: number; 
    days: number[]; 
  }
  

  export interface Contributor {
    author: {
      login: string; 
      id: number; 
      avatar_url: string;
      html_url: string;
    };
    total: number;
    weeks: {
      w: number; 
      a: number; 
      d: number;
      c: number;
    }[];
  }
  

  export interface RepoData {
    id: number; 
    name: string; 
    full_name: string; 
    stargazers_count: number;
    forks_count: number; 
    open_issues_count: number;
    description: string | null; 
    html_url: string; 
    created_at: string; 
    updated_at: string; 
    pushed_at: string; 
  }