import { MockMethod } from 'vite-plugin-mock';
import { resultError, resultSuccess, getRequestToken, requestParams } from '../_util';
import { createFakeUserList } from './user';

// role list.
const roleListData = {
  pageNum: 1,
  pageSize: 10,
  total: 2,
  noPagination: false,
  list: [
    {
      id: 1,
      name: '超级管理员',
      keyword: 'super',
      sort: 0,
      desc: '超级管理员',
      status: 1,
      creator: '系统自动创建',
      createdAt: '2022-04-28 10:54:44',
    },
    {
      id: 2,
      name: '研发人员',
      keyword: 'dev',
      sort: 20,
      desc: '研发人员',
      status: 1,
      creator: '系统自动创建',
      createdAt: '2022-04-28 10:54:44',
    },
  ],
};

export default [
  {
    url: '/basic-api/role/list',
    method: 'get',
    response: (request: requestParams) => {
      const token = getRequestToken(request);
      if (!token) return resultError('Invalid token');
      const checkUser = createFakeUserList().find((item) => `Bearer ${item.token}` === token);
      if (!checkUser) {
        return resultError('The corresponding user information was not obtained!');
      }
      return resultSuccess(roleListData);
    },
  },
] as MockMethod[];
