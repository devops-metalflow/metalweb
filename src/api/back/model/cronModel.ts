import { BasicPageFetchResult } from '/@/api/model/baseModel';
import { NodeListItem } from '/@/api/node/model/nodeModel';

export interface CronShutNodeListRequestModel {
  name?: string;
  creator?: string;
}

export interface CronShutNodeListItem {
  id: number | string;
  name: string;
  startTime: string;
  shutTime: string;
  status: number;
  creator?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface CronShutNodeCreateRequestModel {
  name: string;
  startTime: string;
  shutTime: string;
  nodes: NodeListItem[];
  date: string;
  status?: string;
}

export interface CronShutNodeUpdateRequestModel {
  name: string;
  keyword: string;
  startTime: string;
  shutTime: string;
  NodeIds: number[];
  status?: string;
}

export interface CronShutNodeDeleteRequestModel {
  ids: string;
}

export type CronShutNodeGetResultModel = BasicPageFetchResult<CronShutNodeListItem>;
