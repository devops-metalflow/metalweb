export interface BasicPageParams {
  pageNum: number;
  pageSize: number;
}

export interface BasicFetchResult<T extends any> {
  total: number;
  list: T[];
}

export interface BasicPageFetchResult<T extends any> {
  pageNum: number | string;
  pageSize: number | string;
  total: number | string;
  noPagination?: boolean;
  countCache?: boolean;
  skipCount?: boolean;
  list: T[];
}
