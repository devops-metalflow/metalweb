import { FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table';
import { getRoleList } from '/@/api/sys/role';

export const columns: BasicColumn[] = [
  {
    title: '路径',
    dataIndex: 'path',
    width: 200,
  },
  {
    title: '所属类别',
    dataIndex: 'category',
    width: 180,
  },
  {
    title: '请求方式',
    dataIndex: 'method',
    width: 100,
  },
  {
    title: '说明',
    dataIndex: 'desc',
  },
  {
    title: '创建人',
    dataIndex: 'creator',
    width: 180,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'path',
    label: '所属路径',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'method',
    label: '请求方式',
    component: 'Select',
    colProps: { span: 10 },
    componentProps: {
      options: [
        {
          value: 'GET',
          label: 'GET[获取资源]',
          type: '',
        },
        {
          value: 'POST',
          label: 'POST[创建资源]',
          type: 'success',
        },
        {
          value: 'PUT',
          label: 'PUT[创建/更新资源]',
          type: 'info',
        },
        {
          value: 'PATCH',
          label: 'PATCH[创建/更新资源(区别于PUT, 增量更新)]',
          type: 'warning',
        },
        {
          value: 'DELETE',
          label: 'DELETE[删除资源]',
          type: 'danger',
        },
      ],
    },
  },
];

export const formSchema: FormSchema[] = [
  {
    // 隐藏id，用作判断创建与更新的弹出框
    field: 'id',
    label: '',
    component: 'Input',
    show: false,
  },
  {
    field: 'path',
    label: '所属路径',
    required: true,
    component: 'Input',
  },
  {
    field: 'method',
    label: '请求方式',
    required: true,
    component: 'Select',
    componentProps: {
      options: [
        {
          value: 'GET',
          label: 'GET[获取资源]',
          type: '',
        },
        {
          value: 'POST',
          label: 'POST[创建资源]',
          type: 'success',
        },
        {
          value: 'PUT',
          label: 'PUT[创建/更新资源]',
          type: 'info',
        },
        {
          value: 'PATCH',
          label: 'PATCH[创建/更新资源(区别于PUT, 增量更新)]',
          type: 'warning',
        },
        {
          value: 'DELETE',
          label: 'DELETE[删除资源]',
          type: 'danger',
        },
      ],
    },
  },
  {
    field: 'category',
    label: '所属类别',
    required: true,
    component: 'Input',
  },
  {
    label: '角色授权',
    field: 'roleIds',
    component: 'ApiSelect',
    helpMessage: '可避免到角色管理中添加',
    componentProps: {
      api: () => {
        return getRoleList({ noPagination: true });
      },
      mode: 'multiple',
      resultField: 'list',
      labelField: 'name',
      valueField: 'id',
    },
    ifShow: ({ values }) => {
      // 隐藏id，利用id来判断是否是创建的drawer框
      // console.log(values);
      return !values.id;
    },
  },
  {
    label: '说明',
    field: 'desc',
    component: 'InputTextArea',
  },
];
