import { FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '标签名称',
    dataIndex: 'name',
    // width: 160,
    // align: 'left',
  },
  {
    title: '创建人',
    dataIndex: 'creator',
    // width: 180,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '标签名称',
    component: 'Input',
    colProps: { span: 8 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'name',
    label: '标签名称',
    component: 'Input',
    required: true,
  },
];

export const labelFormSchema: FormSchema[] = [
  {
    label: '',
    field: 'nodes',
    component: 'Input',
    slot: 'customSlot',
    required: true,
  },
];
