export interface SearchParams {
  page: string;
  search: string;
  sort: string;
  dir: string;
}

export interface ListOptions {
  offset: number;
  limit: number;
  search?: string;
  sortField?: string;
  sortDir?: string;
}
