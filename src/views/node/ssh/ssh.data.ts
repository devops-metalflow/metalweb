import { FormSchema } from '/@/components/Form';

export const connectSchema: FormSchema[] = [
  {
    field: 'address',
    label: 'ip地址',
    required: true,
    dynamicDisabled: () => {
      return true;
    },
    component: 'Input',
  },
  {
    field: 'connectType',
    label: '连接类型',
    required: true,
    component: 'RadioButtonGroup',
    defaultValue: 'ssh',
    componentProps: {
      options: [
        { label: 'ssh', value: 'ssh' },
        { label: 'vnc', value: 'vnc' },
      ],
    },
  },
  {
    field: 'sshPort',
    label: '端口',
    required: true,
    component: 'InputNumber',
    defaultValue: 22,
    ifShow: ({ values }) => {
      return values.connectType == 'ssh';
    },
  },
  {
    field: 'vncPort',
    label: '端口',
    required: true,
    component: 'InputNumber',
    defaultValue: 5901,
    ifShow: ({ values }) => {
      return values.connectType == 'vnc';
    },
  },
  {
    field: 'username',
    label: '账户',
    required: true,
    component: 'Input',
    ifShow: ({ values }) => {
      return values.connectType == 'ssh';
    },
  },
  {
    field: 'password',
    label: '密码',
    required: true,
    component: 'InputPassword',
  },
];

export const copySchema: FormSchema[] = [
  {
    field: 'text',
    label: '',
    required: true,
    component: 'InputTextArea',
    componentProps: {
      placeholder: '请输入内容',
    },
  },
];
