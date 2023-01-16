import { BasicColumn, FormSchema } from '/@/components/Table';
import { getRoleList } from '/@/api/sys/role';

export const columns: BasicColumn[] = [
  {
    title: '用户名',
    dataIndex: 'username',
    width: 120,
  },
  {
    title: '科室',
    dataIndex: 'officeName',
    width: 120,
  },
  {
    title: '部门',
    dataIndex: 'orgName',
    width: 120,
  },
  {
    title: '角色',
    dataIndex: 'nickName',
    width: 120,
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    width: 180,
  },
  {
    title: '创建人',
    dataIndex: 'creator',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'username',
    label: '用户名',
    component: 'Input',
    colProps: { span: 8 },
  },
];

export const accountFormSchema: FormSchema[] = [
  {
    field: 'username',
    label: '用户名',
    component: 'Input',
    required: true,
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'Input',
    required: true,
  },
  {
    label: '角色',
    field: 'roleId',
    component: 'ApiSelect',
    componentProps: {
      api: () => {
        return getRoleList({ noPagination: true });
      },
      resultField: 'list',
      labelField: 'name',
      valueField: 'id',
    },
    required: true,
  },
  {
    field: 'officeName',
    label: '科室',
    component: 'Input',
    required: true,
  },
  {
    field: 'orgName',
    label: '部门',
    component: 'Input',
    required: true,
  },
];
