import { defHttp } from '/@/utils/http/axios';

import {
  CronShutNodeCreateRequestModel,
  CronShutNodeDeleteRequestModel,
  CronShutNodeGetResultModel,
  CronShutNodeListRequestModel,
  CronShutNodeUpdateRequestModel,
} from '/@/api/back/model/cronModel';

enum Api {
  GetCronShutNodeList = '/cron/list',
  CreateCronShutNode = '/cron/create',
  UpdateCronShutNode = '/cron/update/',
  DeleteCronShutNode = '/cron/delete/batch',
}

export const getCronShutNodeList = (params?: CronShutNodeListRequestModel) =>
  defHttp.get<CronShutNodeGetResultModel>({
    url: Api.GetCronShutNodeList,
    params,
  });

export const createCronShutNode = (params: CronShutNodeCreateRequestModel) =>
  defHttp.post({
    url: Api.CreateCronShutNode,
    params,
  });

export const updateCronShutNode = (id: number, params: CronShutNodeUpdateRequestModel) =>
  defHttp.post({
    url: `${Api.UpdateCronShutNode}${id}`,
    params,
  });

export const deleteCronShutNode = (params: CronShutNodeDeleteRequestModel) =>
  defHttp.delete({
    url: Api.DeleteCronShutNode,
    params,
  });
