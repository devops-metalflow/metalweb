export interface CountDataModel {
  userCount: number;
  nodeCount: number;
  normalNodeCount: number;
  highPerformanceNodeCount: number;
}

export interface RegionNodeItemModel {
  region: string;
  count: number;
}

export interface ManagerNodeItemModel {
  manager: string;
  count: number;
}

export interface HealthNodeItemModel {
  health: number;
  count: number;
}

export interface PerformanceNodeModel {
  performance: number;
  count: number;
}
