import { BasicPageFetchResult } from '/@/api/model/baseModel';

export interface WorkerListRequestModel {
  name?: string;
  autoDeploy?: number;
  creator?: string;
  noPagination?: boolean;
}

export interface WorkerListItem {
  id: number | string;
  name: string;
  desc?: string;
  port: number;
  startCmd: string;
  deployCmd: string;
  stopCmd: string;
  deleteCmd: string;
  autoDeploy: number;
  serviceReq?: string;
  checkReq?: string;
  creator?: string;
  createAt?: string;
}

export interface WorkerCreateRequestModel {
  name: string;
  desc?: string;
  port: number;
  startCmd: string;
  deployCmd: string;
  stopCmd: string;
  deleteCmd?: string;
  autoDeploy: number;
  serviceReq?: string;
  checkReq?: string;
}

export interface WorkerUpdateRequestModel {
  name?: string;
  desc?: string;
  port?: number;
  startCmd?: string;
  deployCmd?: string;
  stopCmd?: string;
  deleteCmd?: string;
  autoDeploy?: number;
  serviceReq?: string;
  checkReq?: string;
}

export interface WorkerDeleteRequestModel {
  ids: string;
}

export type WorkerListGetResultModel = BasicPageFetchResult<WorkerListItem>;
