import { MockMethod } from 'vite-plugin-mock';
import { resultError, resultSuccess, getRequestToken, requestParams } from '../_util';

export function createFakeUserList() {
  return [
    {
      id: 1,
      username: 'admin',
      password: '123456',
      email: 'admin@example.com',
      orgName: '开发部',
      officeName: '开发科',
      introduction: '超管就是不讲武德',
      workPlace: '地球',
      status: 1,
      token: 'fakeToken1',
      roles: ['super'],
      roleId: 1,
      creator: '系统自动创建',
      nickName: '超级管理员',
      createdAt: '2023-01-10 19:42:57',
    },
    {
      id: 2,
      username: 'guest',
      password: '123456',
      email: 'guest@example.com',
      orgName: '开发部',
      officeName: '开发科',
      introduction: '这个人很懒，什么也没留下',
      workPlace: '地球',
      status: 1,
      roleId: 2,
      token: 'fakeToken2',
      roles: ['dev'],
      creator: '系统自动创建',
      nickName: '访客',
      createdAt: '2023-01-10 19:42:57',
    },
  ];
}

export default [
  // mock user login
  {
    url: '/basic-api/base/login',
    timeout: 200,
    method: 'post',
    response: ({ body }) => {
      const { username, password } = body;
      const checkUser = createFakeUserList().find(
        (item) => item.username === username && password === item.password
      );
      if (!checkUser) {
        return resultError('Incorrect account or password！');
      }
      const { token } = checkUser;
      const d = new Date();
      d.setDate(d.getDate() + 2);

      return resultSuccess({
        token,
      });
    },
  },
  {
    url: '/basic-api/user/info',
    method: 'get',
    response: (request: requestParams) => {
      const token = getRequestToken(request);
      if (!token) return resultError('Invalid token');
      const checkUser = createFakeUserList().find((item) => `Bearer ${item.token}` === token);
      if (!checkUser) {
        return resultError('The corresponding user information was not obtained!');
      }
      return resultSuccess(checkUser);
    },
  },
  {
    url: '/basic-api/user/list',
    method: 'get',
    response: (request: requestParams) => {
      const token = getRequestToken(request);
      if (!token) return resultError('Invalid token');
      const checkUser = createFakeUserList().find((item) => `Bearer ${item.token}` === token);
      if (!checkUser) {
        return resultError('The corresponding user information was not obtained!');
      }
      return resultSuccess(createFakeUserList());
    },
  },
  {
    url: '/basic-api/base/logout',
    timeout: 200,
    method: 'post',
    response: (request: requestParams) => {
      const token = getRequestToken(request);
      if (!token) return resultError('Invalid token');
      const checkUser = createFakeUserList().find((item) => `Bearer ${item.token}` === token);
      if (!checkUser) {
        return resultError('Invalid token!');
      }
      return resultSuccess(undefined, { msg: 'Token has been destroyed' });
    },
  },
] as MockMethod[];
