import { BasicPageFetchResult } from '/@/api/model/baseModel';

export interface ApiListRequestModel {
  path?: string;
  method?: string;
  category?: string;
  desc?: string;
}

export interface ApiListItem {
  id: number | string;
  path: string;
  method: string;
  category: string;
  title?: string;
  desc?: string;
  creator?: string;
  createAt?: string;
}

export interface CreateApiRequestModel {
  path: string;
  category: string;
  method: string;
  desc?: string;
  title?: string;
  roleIds: (number | string)[];
}

export interface ApiDeleteRequestModel {
  ids: string;
}

export type ApiListGetResultModel = BasicPageFetchResult<ApiListItem>;
export type UpdateApiRequestModel = CreateApiRequestModel;
