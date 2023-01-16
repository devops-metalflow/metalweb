import { defHttp } from '/@/utils/http/axios';
import {
  getMenuListByRoleId,
  getOriginMenuListResultModel,
  MenuDeleteRequestModel,
  RequestMenuCreateModel,
  RequestMenuListModel,
  RequestMenuUpdateModel,
} from './model/menuModel';

enum Api {
  GetMenuTree = '/menu/tree',
  getAllMenuByRoleId = '/menu/all/',
  GetMenuList = '/menu/list',
  UpdateMenuById = '/menu/update/',
  CreateMenu = '/menu/create',
  DeleteMenu = '/menu/delete/batch',
}

/**
 * @description: Get user menu based on id
 */

export const getMenuTree = () => {
  return defHttp.get<getOriginMenuListResultModel>({ url: Api.GetMenuTree });
};

export const getAllMenuByRoleId = (id: number) =>
  defHttp.get<getMenuListByRoleId>({
    url: `${Api.getAllMenuByRoleId}${id}`,
  });

export const getMenuList = (params: RequestMenuListModel) =>
  defHttp.get<getOriginMenuListResultModel>({
    url: Api.GetMenuList,
    params,
  });

export const createMenu = (params: RequestMenuCreateModel) =>
  defHttp.post({
    url: Api.CreateMenu,
    params,
  });

export const updateMenu = (id: number, params: RequestMenuUpdateModel) =>
  defHttp.patch({
    url: `${Api.UpdateMenuById}${id}`,
    params,
  });

export const deleteMenu = (params: MenuDeleteRequestModel) =>
  defHttp.delete({
    url: Api.DeleteMenu,
    params,
  });
