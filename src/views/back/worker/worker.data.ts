import { FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';

export const columns: BasicColumn[] = [
  {
    title: 'worker名称',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '暴露端口',
    dataIndex: 'port',
    width: 100,
  },
  {
    title: '自动部署',
    dataIndex: 'autoDeploy',
    width: 100,
    customRender: ({ record }) => {
      const autoDeploy = record.autoDeploy;
      const enable = ~~autoDeploy === 1;
      const color = enable ? 'green' : 'gray';
      const text = enable ? '是' : '否';
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: '描述',
    dataIndex: 'desc',
    width: 180,
  },
  {
    title: '创建人',
    dataIndex: 'creator',
    width: 180,
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: 'worker名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'autoDeploy',
    label: '自动部署',
    component: 'Select',
    componentProps: {
      options: [
        { label: '是', value: '1' },
        { label: '否', value: '0' },
      ],
    },
    colProps: { span: 8 },
  },
  {
    field: 'creator',
    label: '创建人',
    component: 'Input',
    colProps: { span: 8 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'name',
    label: 'worker名称',
    required: true,
    component: 'Input',
  },
  {
    field: 'port',
    label: '暴露端口',
    required: true,
    component: 'InputNumber',
  },
  {
    field: 'autoDeploy',
    label: '初始化部署',
    required: true,
    component: 'RadioButtonGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 },
      ],
    },
  },
  {
    label: '说明',
    field: 'desc',
    component: 'InputTextArea',
  },
  {
    field: 'deployCmd',
    label: '部署命令',
    required: true,
    component: 'InputTextArea',
  },
  {
    field: 'startCmd',
    label: '启动命令',
    required: true,
    component: 'InputTextArea',
  },
  {
    field: 'stopCmd',
    label: '停止命令',
    required: true,
    component: 'InputTextArea',
  },
  {
    field: 'deleteCmd',
    label: '删除命令',
    component: 'InputTextArea',
  },
  {
    field: 'serviceReq',
    label: '接收请求',
    component: 'Input',
  },
  {
    field: 'checkReq',
    label: '检查请求',
    component: 'Input',
  },
];
