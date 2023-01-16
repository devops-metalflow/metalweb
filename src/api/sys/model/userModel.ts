import { BasicPageFetchResult } from '/@/api/model/baseModel';

/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string;
  password: string;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: string | number;
  token: string;
  role: RoleInfo;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  roles: string[];
  // 用户id
  id: number | string;
  // 姓名
  username: string;
  // 邮件
  email: string;
  // 角色名
  nickName: string;
  // 角色排序
  roleSort: string | number;
  // 科室
  officeName?: string;
  // 部门
  orgName?: string;
  // 头像
  avatar?: string;
  // 常驻地
  workPlace?: string;
  // 介绍
  introduction?: string;
}

export interface UserListRequestModel {
  // 工号
  username?: string;
  // 部门
  orgName?: string;
  // 科室
  officeName?: string;
  // 邮件
  email?: string;
  // 页面尺寸
  pageNum?: number | string;
  pageSize?: number | string;
}

export interface CreateUserRequestModel {
  username?: string;
  email?: string;
  orgName?: string;
  officeName?: string;
  nickName?: string;
  roleId: number | string;
}

export interface DeleteUserRequestModel {
  ids: string;
}

export type UserListModel = BasicPageFetchResult<GetUserInfoModel>;
export type UpdateUserRequestModel = CreateUserRequestModel;
