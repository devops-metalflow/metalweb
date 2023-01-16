import { resultSuccess, resultError, getRequestToken, requestParams } from '../_util';
import { MockMethod } from 'vite-plugin-mock';
import { createFakeUserList } from '../sys/user';

// node data.
const nodePerformanceData = [
  {
    performance: 0,
    count: 3,
  },
  {
    performance: 1,
    count: 5,
  },
  {
    performance: 2,
    count: 2,
  },
];

// healthData.
const nodeHealthData = [
  {
    health: 0,
    count: 4,
  },
  {
    health: 1,
    count: 3,
  },
  {
    health: 2,
    count: 3,
  },
];

// countData.
const nodeCountData = {
  userCount: 2,
  nodeCount: 10,
  normalNodeCount: 4,
  highPerformanceNodeCount: 3,
};

// regionData.
const nodeRegionData = [
  {
    count: 1,
  },
  {
    region: 'Chengdu',
    count: 2,
  },
  {
    region: 'Shanghai',
    count: 3,
  },
  {
    region: "Xi'an",
    count: 4,
  },
];

// managerData.
const nodeManagerData = [
  {
    count: 5,
    manager: '张三',
  },
  {
    manager: '李四',
    count: 3,
  },
  {
    manager: '王麻子',
    count: 2,
  },
];

export default [
  {
    url: '/basic-api/dashboard/performanceNodeData',
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

      return resultSuccess(nodePerformanceData);
    },
  },
  {
    url: '/basic-api/dashboard/healthNodeData',
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

      return resultSuccess(nodeHealthData);
    },
  },
  {
    url: '/basic-api/dashboard/countData',
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

      return resultSuccess(nodeCountData);
    },
  },
  {
    url: '/basic-api/dashboard/regionNodeData',
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

      return resultSuccess(nodeRegionData);
    },
  },
  {
    url: '/basic-api/dashboard/managerNodeData',
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

      return resultSuccess(nodeManagerData);
    },
  },
] as MockMethod[];
