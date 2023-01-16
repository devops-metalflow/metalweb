import { resultSuccess, resultError, getRequestToken, requestParams } from '../_util';
import { MockMethod } from 'vite-plugin-mock';
import Mock from 'mockjs';
import { createFakeUserList } from '../sys/user';

// node list data.
const nodeListData = Mock.mock({
  pageNum: 1,
  pageSize: 10,
  total: 10,
  noPagination: false,
  'list|10': [
    {
      id: '@id',
      address: /\d{2,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,
      createdAt: '@datetime',
      manager: '@cname',
      'region|1': ['Shanghai', 'Chengdu', "Xi'an"],
      creator: '@cname()',
      'performance|+1': [0, 1, 2],
      sshPort: 22,
      asset: /A\d{8}/,
      'health|+1': [0, 1, 2],
      information: null,
      labels: [
        {
          id: 1,
          'name|1': ['test', 'build', 'k8s'],
        },
      ],
    },
  ],
});

// label list data.
const labelListData = Mock.mock({
  pageNum: 1,
  pageSize: 10,
  total: 2,
  noPagination: false,
  'list|2': [
    {
      id: '@id',
      address: /\d{2,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,
      createdAt: '@datetime',
      creator: '@cname()',
      updatedAt: '@datetime',
      name: '@word',
    },
  ],
});

export default [
  {
    url: '/basic-api/node/list',
    timeout: 1000,
    method: 'get',
    response: (request: requestParams) => {
      const token = getRequestToken(request);
      if (!token) {
        return resultError('Invalid token!');
      }
      const checkUser = createFakeUserList().find((item) => `Bearer ${item.token}` === token);
      if (!checkUser) {
        return resultError('Invalid user token!');
      }

      return resultSuccess(nodeListData);
    },
  },
  {
    url: '/basic-api/label/list',
    timeout: 1000,
    method: 'get',
    response: (request: requestParams) => {
      const token = getRequestToken(request);
      if (!token) {
        return resultError('Invalid token!');
      }
      const checkUser = createFakeUserList().find((item) => `Bearer ${item.token}` === token);
      if (!checkUser) {
        return resultError('Invalid user token!');
      }

      return resultSuccess(labelListData);
    },
  },
] as MockMethod[];
