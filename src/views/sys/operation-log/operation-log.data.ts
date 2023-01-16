import { BasicColumn, FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';

export const columns: BasicColumn[] = [
  {
    title: 'api简介',
    dataIndex: 'apiDesc',
  },
  {
    title: 'api路径',
    dataIndex: 'path',
  },
  {
    title: '请求方式',
    dataIndex: 'method',
    customRender: ({ record }) => {
      const method = record.method;
      const colors = {
        POST: 'green',
        PATCH: 'orange',
        DELETE: 'red',
        GET: 'blue',
      };
      return h(Tag, { color: colors[method] }, () => method);
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    customRender: ({ record }) => {
      const status = record.status;
      const enable = ~~status === 201;
      const color = enable ? 'green' : 'orange';
      return h(Tag, { color: color }, () => status);
    },
  },
  {
    title: '工号',
    dataIndex: 'username',
  },
  {
    title: '角色',
    dataIndex: 'roleName',
  },
  {
    title: '请求耗时(ms)',
    dataIndex: 'latency',
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
  },
  {
    title: '浏览器信息',
    dataIndex: 'userAgent',
    width: 180,
  },
];

export const searchFormSchema: FormSchema[] = [
  // {
  //   field: 'method',
  //   label: '请求方式',
  //   component: 'Input',
  //   colProps: { span: 8 },
  // },
  {
    field: 'path',
    label: '路径',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'username',
    label: '工号',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'InputNumber',
    colProps: { span: 8 },
  },
];
