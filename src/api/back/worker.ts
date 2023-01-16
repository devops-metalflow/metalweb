import {
  WorkerCreateRequestModel,
  WorkerDeleteRequestModel,
  WorkerListGetResultModel,
  WorkerListRequestModel,
  WorkerUpdateRequestModel,
} from '/@/api/back/model/workerModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetWorkerList = '/worker/list',
  CreateWorker = '/worker/create',
  UpdateWorker = '/worker/update/',
  DeleteWorker = '/worker/delete/batch',
}

export const getWorkerList = (params?: WorkerListRequestModel) =>
  defHttp.get<WorkerListGetResultModel>({
    url: Api.GetWorkerList,
    params,
  });

export const createWorker = (params: WorkerCreateRequestModel) =>
  defHttp.post({
    url: Api.CreateWorker,
    params,
  });

export const updateWorker = (id: number, params: WorkerUpdateRequestModel) =>
  defHttp.patch({
    url: `${Api.UpdateWorker}${id}`,
    params,
  });

export const deleteWorker = (params: WorkerDeleteRequestModel) =>
  defHttp.delete({
    url: Api.DeleteWorker,
    params,
  });
