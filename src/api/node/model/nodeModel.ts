import { BasicPageFetchResult } from '/@/api/model/baseModel';
import { LabelListItem } from '../../back/model/labelModel';

export interface NodeListRequestModel {
  address?: string;
  asset?: string;
  health?: number | string;
  performance?: number | string;
  region?: string;
  labels?: LabelListItem[];
  noPagination?: boolean;
}

export interface NodeListItem {
  id: number;
  address: string;
  manager: string;
  metrics: string;
  sshPort: number;
  asset: string;
  health: number;
  performance: number;
  region: string;
  remark: string;
  labels: LabelListItem[];
  creator?: string;
  createdAt?: string;
  information?: any;
}

export interface CollectionNodeItem {
  collectionId: number;
  description: string;
  id: number;
  address: string;
  manager: string;
  metrics: string;
  sshPort: number;
  asset: string;
  health: number;
  performance: number;
  region: string;
  remark: string;
  labels: LabelListItem[];
  creator?: string;
  createdAt?: string;
  information?: any;
}

export interface NodeCreateRequestModel {
  address?: string;
  manager?: string;
  metrics?: string;
  sshPort?: number | string;
  asset?: string;
  health?: number | string;
  performance?: number | string;
  region?: string;
  remark?: string;
  labelIds?: number[] | string[];
  information?: string;
}

export interface NodeIdsRequestModel {
  ids: string;
}

export interface NodeShellConnectModel {
  address: string;
  sshPort: number;
  username: string;
  password: string;
}

export interface FilepathModel {
  path: string;
  sshId: string;
}

export interface ResizeShellModel {
  sshId: string;
  width: string;
  high: string;
}

export interface UpdateNodeShellModel {
  path: string;
  content: string;
  sshId: string;
}

export type NodeListGetResultModel = BasicPageFetchResult<NodeListItem>;
export type NodeUpdateRequestModel = NodeCreateRequestModel;
