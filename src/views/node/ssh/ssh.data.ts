import { FormSchema } from '/@/components/Form';

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
