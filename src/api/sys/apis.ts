import { defHttp } from '/@/utils/http/axios';
import { getMenuListByRoleId } from '/@/api/sys/model/menuModel';
import {
  ApiDeleteRequestModel,
  ApiListGetResultModel,
  ApiListRequestModel,
  CreateApiRequestModel,
  UpdateApiRequestModel,
} from '/@/api/sys/model/apiModel';

enum Api {
  GetApiList = '/api/list',
  GetAllApiGroupByCategoryByRoleId = '/api/all/category/',
  CreateApi = '/api/create',
  DeleteApi = '/api/delete/batch',
  UpdateApi = '/api/update/',
}

export const getApiList = (params: ApiListRequestModel) =>
  defHttp.get<ApiListGetResultModel>({
    url: `${Api.GetApiList}`,
    params,
  });

export const getAllApiGroupByCategoryByRoleId = (id: number) =>
  defHttp.get<getMenuListByRoleId>({
    url: `${Api.GetAllApiGroupByCategoryByRoleId}${id}`,
  });

export const createApi = (params: CreateApiRequestModel) =>
  defHttp.post({
    url: Api.CreateApi,
    params,
  });

export const deleteApi = (params: ApiDeleteRequestModel) =>
  defHttp.delete({
    url: Api.DeleteApi,
    params,
  });

export const updateApi = (id: number, params: UpdateApiRequestModel) =>
  defHttp.patch({
    url: `${Api.UpdateApi}${id}`,
    params,
  });
