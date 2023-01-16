import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '角色名称',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '关键字',
    dataIndex: 'keyword',
    width: 180,
  },
  {
    title: '排序',
    dataIndex: 'sort',
    width: 50,
  },
  {
    title: '创建人',
    dataIndex: 'creator',
    width: 180,
  },
  {
    title: '说明',
    dataIndex: 'desc',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '角色名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '启用', value: '0' },
        { label: '停用', value: '1' },
      ],
    },
    colProps: { span: 8 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'name',
    label: '角色名称',
    required: true,
    component: 'Input',
  },
  {
    field: 'keyword',
    label: '关键字',
    required: true,
    component: 'Input',
  },
  {
    field: 'sort',
    label: '排序',
    required: true,
    component: 'InputNumber',
  },
  {
    label: '说明',
    field: 'desc',
    component: 'InputTextArea',
  },
  {
    label: ' ',
    field: 'menu',
    slot: 'menu',
    component: 'Input',
  },
  {
    label: ' ',
    field: 'api',
    slot: 'api',
    component: 'Input',
  },
];
