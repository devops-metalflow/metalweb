import { defHttp } from '/@/utils/http/axios';
import {
  CountDataModel,
  HealthNodeItemModel,
  ManagerNodeItemModel,
  PerformanceNodeModel,
  RegionNodeItemModel,
} from '/@/api/dashboard/mode/dashboardModel';

enum Api {
  CountData = '/dashboard/countData',
  RegionNodeData = '/dashboard/regionNodeData',
  ManagerNodeData = '/dashboard/managerNodeData',
  HealthNodeData = '/dashboard/healthNodeData',
  PerformanceNodeData = '/dashboard/performanceNodeData',
}

export const countData = () =>
  defHttp.get<CountDataModel>({
    url: Api.CountData,
  });

export const regionNodeData = () =>
  defHttp.get<RegionNodeItemModel[]>({
    url: Api.RegionNodeData,
  });

export const managerNodeData = () =>
  defHttp.get<ManagerNodeItemModel[]>({
    url: Api.ManagerNodeData,
  });

export const healthNodeData = () =>
  defHttp.get<HealthNodeItemModel[]>({
    url: Api.HealthNodeData,
  });

export const performanceNodeData = () =>
  defHttp.get<PerformanceNodeModel[]>({
    url: Api.PerformanceNodeData,
  });
