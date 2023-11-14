import { CollectionNodeItem } from '/@/api/node/model/nodeModel';

export interface CollectNodeIdModal {
  nodeId: number;
}

export interface CollectUpdate {
  description: string;
}

export type MyCollections = CollectionNodeItem[];
