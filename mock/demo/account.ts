import { MockMethod } from 'vite-plugin-mock';
import { resultSuccess, resultError } from '../_util';

const userInfo = {
  id: 1,
  username: 'Jack',
  email: 'super@example.com',
  officeName: '开发科',
  orgName: '开发部',
  workPlace: '地球',
  introduction: '超管就是不讲武德',
  nickName: '超级管理员',
  roles: ['super'],
  roleSort: 0,
};

export default [
  {
    url: '/user/info',
    timeout: 1000,
    method: 'get',
    response: () => {
      return resultSuccess(userInfo);
    },
  },
  {
    url: '/basic-api/user/sessionTimeout',
    method: 'post',
    statusCode: 401,
    response: () => {
      return resultError();
    },
  },
] as MockMethod[];
