import { BasicPageFetchResult } from '/@/api/model/baseModel';

export interface LabelListRequestModel {
  id: number | string;
}

export interface LabelListItem {
  id: number | string;
  name: string;
  creator?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface LabelCreateRequestModel {
  name: string;
}

export interface LabelUpdateRequestModel {
  name: string;
}

export interface LabelDeleteRequestModel {
  ids: string;
}

export type LabelListGetResultModel = BasicPageFetchResult<LabelListItem>;
