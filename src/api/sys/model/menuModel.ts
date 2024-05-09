import type { RouteMeta } from 'vue-router';
export interface RouteItem {
  path: string;
  component: any;
  meta: RouteMeta;
  name?: string;
  alias?: string | string[];
  redirect?: string;
  caseSensitive?: boolean;
  children?: RouteItem[];
}

/**
 * @description: Get menu return value
 */
export type getMenuListResultModel = RouteItem[];

// 原始的数据请求
export interface OriginRouteItem {
  path: string;
  component: any;
  name?: string;
  alias?: string | string[];
  redirect?: string;
  caseSensitive?: boolean;
  affix?: number | string;
  icon?: string;
  title: string;
  onlyContent?: number | string;
  newTab?: number | string;
  visible: number | string;
  children?: OriginRouteItem[];
}

export interface RequestMenuListModel {
  name?: string;
  title?: string;
  path?: string;
  component?: string;
  redirect?: string;
  status?: number;
  visible?: number;
  breadcrumb?: number;
  creator?: string;
}

export interface RequestMenuUpdateModel {
  name?: string;
  title?: string;
  icon?: string;
  path?: string;
  redirect?: string;
  component?: string;
  sort?: number;
  status?: number;
  visible?: number;
  parentId?: number;
}

export interface RequestMenuCreateModel {
  name?: string;
  title?: string;
  icon?: string;
  path?: string;
  redirect?: string;
  component?: string;
  sort?: number;
  status?: number;
  visible?: number;
  parentId?: number;
}

export interface MenuDeleteRequestModel {
  ids: string;
}

export type getOriginMenuListResultModel = OriginRouteItem[];

export interface getMenuListByRoleId {
  list: OriginRouteItem[];
  accessIds: (number | string)[];
}
