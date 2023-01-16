import {
  RoleCreateRequestModel,
  RoleListGetResultModel,
  RoleListRequestModel,
  RoleUpdateRequestModel,
  RoleDeleteRequestModel,
  UpdateRoleMenuModel,
  UpdateRoleApiModel,
} from '/@/api/sys/model/roleModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetRoleList = '/role/list',
  CreateRole = '/role/create',
  UpdateRole = '/role/update/',
  UpdateRoleApis = '/role/apis/update/',
  UpdateRoleMenus = '/role/menus/update/',
  DeleteRole = '/role/delete/batch',
}

export const getRoleList = (params?: RoleListRequestModel) =>
  defHttp.get<RoleListGetResultModel>({
    url: Api.GetRoleList,
    params,
  });

export const createRole = (params: RoleCreateRequestModel) =>
  defHttp.post({
    url: Api.CreateRole,
    params,
  });

export const updateRole = (id: number, params: RoleUpdateRequestModel) =>
  defHttp.patch({
    url: `${Api.UpdateRole}${id}`,
    params,
  });

export const deleteRole = (params: RoleDeleteRequestModel) =>
  defHttp.delete({
    url: Api.DeleteRole,
    params,
  });

export const updateRoleMenus = (id: number, params: UpdateRoleMenuModel) =>
  defHttp.patch({
    url: `${Api.UpdateRoleMenus}${id}`,
    params,
  });

export const updateRoleApis = (id: number, params: UpdateRoleApiModel) =>
  defHttp.patch({
    url: `${Api.UpdateRoleApis}${id}`,
    params,
  });
