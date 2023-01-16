import { BasicPageFetchResult } from '/@/api/model/baseModel';

export interface RoleListRequestModel {
  name?: string;
  keyword?: string;
  sort?: number | string;
  creator?: string;
  noPagination?: boolean;
}

export interface RoleListItem {
  id: number | string;
  name: string;
  keyword: string;
  sort: number | string;
  desc?: string;
  creator?: string;
  createAt?: string;
}

export interface RoleCreateRequestModel {
  name: string;
  keyword: string;
  sort: number | string;
  desc?: string;
}

export interface RoleDeleteRequestModel {
  ids: string;
}

export interface UpdateRoleMenuModel {
  create: (string | number)[];
  delete: (string | number)[];
}

export interface UpdateRoleApiModel {
  create: (string | number)[];
  delete: (string | number)[];
}

export type RoleListGetResultModel = BasicPageFetchResult<RoleListItem>;
export type RoleUpdateRequestModel = RoleCreateRequestModel;
