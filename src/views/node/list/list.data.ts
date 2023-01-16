import { BasicColumn, FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { getLabelList } from '/@/api/back/label';

export const columns: BasicColumn[] = [
  {
    title: '地址',
    dataIndex: 'address',
    width: 120,
  },
  {
    title: '资产编号',
    dataIndex: 'asset',
    width: 120,
  },
  {
    title: '责任人',
    dataIndex: 'manager',
    width: 120,
  },
  {
    title: '地域',
    dataIndex: 'region',
    width: 120,
    customRender: ({ record }) => {
      const region = record.region;
      const regions = ['Chengdu', 'Shanghai', "Xi'an", 'Other'];
      const colors = ['green', '#1b6e95', '#0f8666', '#74767a'];
      const texts = ['成都', '上海', '西安', '其他'];
      if (region) {
        const index = regions.indexOf(region);
        return h(Tag, { color: colors[index] }, () => texts[index]);
      } else {
        return '';
      }
    },
  },
  {
    title: '健康度',
    dataIndex: 'health',
    width: 80,
    customRender: ({ record }) => {
      const health = record.health;
      const colors = ['green', 'red', 'purple'];
      const texts = ['运行中', '异常', '已停机'];
      return h(Tag, { color: colors[health] }, () => texts[health]);
    },
  },
  {
    title: '性能',
    dataIndex: 'performance',
    width: 80,
    customRender: ({ record }) => {
      const performance = record.performance;
      const colors = ['green', 'red', 'purple'];
      const texts = ['高', '中', '低'];
      return h(Tag, { color: colors[performance] }, () => texts[performance]);
    },
  },
  {
    dataIndex: 'labels',
    slots: {
      title: 'labelTitle',
      customRender: 'labels',
    },
  },
  // {
  //   title: '配置',
  //   dataIndex: 'metrics',
  //   width: 300,
  // },
  {
    title: '创建人',
    dataIndex: 'creator',
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'address',
    label: '地址',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'manager',
    label: '责任人',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'health',
    label: '健康度',
    component: 'Select',
    colProps: { span: 8 },
    componentProps: {
      options: [
        { label: '运行中', value: 0 },
        { label: '异常', value: 1 },
        { label: '已停机', value: 2 },
      ],
    },
  },
  {
    field: 'performance',
    label: '性能',
    component: 'Select',
    colProps: { span: 8 },
    componentProps: {
      options: [
        { label: '高', value: 0 },
        { label: '中', value: 1 },
        { label: '低', value: 2 },
      ],
    },
  },
  {
    field: 'region',
    label: '地域',
    component: 'Select',
    colProps: { span: 8 },
    componentProps: {
      options: [
        { label: '上海', value: 'Shanghai' },
        { label: '成都', value: 'Chengdu' },
        { label: '西安', value: "Xi'an" },
        { label: '其他', value: 'Other' },
      ],
    },
  },
  {
    field: 'asset',
    label: '资产编号',
    component: 'Input',
    colProps: { span: 8 },
  },
];

export const AddFormSchema: FormSchema[] = [
  {
    field: 'Address',
    label: '地址',
    component: 'Input',
    required: true,
  },
  {
    field: 'sshPort',
    label: 'ssh端口',
    component: 'InputNumber',
    required: true,
    defaultValue: 22,
  },
  // {
  //   field: 'asset',
  //   label: '资产名称',
  //   component: 'Input',
  //   required: true,
  // },
  {
    label: '标签',
    field: 'labelIds',
    component: 'ApiSelect',
    componentProps: {
      api: getLabelList,
      mode: 'multiple',
      resultField: 'list',
      labelField: 'name',
      valueField: 'id',
    },
    required: true,
  },
  {
    field: 'remark',
    label: '备注',
    component: 'InputTextArea',
  },
];

export const UploadFormSchema: FormSchema[] = [
  {
    field: 'remoteDir',
    label: '上传到目录',
    component: 'Input',
    required: true,
    defaultValue: '/tmp',
  },
  {
    field: 'runnable',
    label: '是否执行',
    component: 'Switch',
    required: true,
    ifShow: ({ values }) => {
      return !!values.remoteDir;
    },
    defaultValue: true,
  },
  {
    field: 'upload',
    component: 'Input',
    label: '上传文件',
    slot: 'customSlot',
    ifShow: ({ values }) => {
      return !!values.remoteDir;
    },
  },
];
