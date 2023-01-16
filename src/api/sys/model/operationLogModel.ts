import { BasicPageFetchResult } from '/@/api/model/baseModel';

export interface OperationLogListRequestModel {
  method?: string;
  path?: string;
  username?: string;
  status?: string;
  noPagination?: boolean;
}

export interface OperationLogListItem {
  id: number | string;
  apiDesc: string;
  path: string;
  method: number;
  header: string;
  body: string;
  data: string;
  status: number;
  username: string;
  roleName: string;
  latency: string;
  userAgent: string;
  createAt?: string;
}

export type OperationLogListGetResultModel = BasicPageFetchResult<OperationLogListItem>;
