import { defHttp } from '/@/utils/http/axios';
import {
  LoginParams,
  LoginResultModel,
  GetUserInfoModel,
  UserListModel,
  UserListRequestModel,
  CreateUserRequestModel,
  UpdateUserRequestModel,
  DeleteUserRequestModel,
} from './model/userModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  Login = '/base/login',
  Logout = '/base/logout',
  GetIdempotenceToken = '/base/idempotenceToken',
  refreshToken = '/base/refreshToken',
  GetUserInfo = '/user/info',
  GetUserList = '/user/list',
  UpdateUser = '/user/update/',
  CreateUser = '/user/create',
  DeleteUser = '/user/delete/batch',
  GetPermCode = '/getPermCode',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    }
  );
}

export const refreshToken = () => defHttp.post({ url: Api.refreshToken });
/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo });
}

export const getUserList = (params?: UserListRequestModel) =>
  defHttp.get<UserListModel>({ url: Api.GetUserList, params: params });

export const createUser = (params: CreateUserRequestModel) =>
  defHttp.post({ url: Api.CreateUser, params });

export const updateUser = (id: number, params: UpdateUserRequestModel) =>
  defHttp.patch({ url: `${Api.UpdateUser}${id}`, params });

export const deleteUser = (params: DeleteUserRequestModel) =>
  defHttp.delete({ url: Api.DeleteUser, params });

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.post({ url: Api.Logout });
}

export const GetIdempotenceToken = () => defHttp.get({ url: Api.GetIdempotenceToken });
