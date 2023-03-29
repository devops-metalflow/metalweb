import { FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { getNodeList } from '/@/api/node/node';

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '任务名称',
    component: 'Input',
    colProps: { span: 8 },
  },
];

export const columns: BasicColumn[] = [
  {
    title: '任务名称',
    dataIndex: 'name',
  },
  {
    title: '关键字',
    dataIndex: 'keyword',
  },
  {
    title: '关机配置',
    dataIndex: 'shutTime',
  },
  {
    title: '开机配置',
    dataIndex: 'startTime',
  },
  {
    title: '任务状态',
    dataIndex: 'status',
    width: 80,
    customRender: ({ record }) => {
      const status = record.status;
      const enable = ~~status === 1;
      const color = enable ? 'green' : 'red';
      const text = enable ? '启用' : '停用';
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: '创建人',
    dataIndex: 'creator',
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'name',
    label: '任务名称',
    required: true,
    component: 'Input',
  },
  {
    field: 'keyword',
    label: '任务关键字',
    required: true,
    component: 'Input',
    componentProps: {
      placeholder: '请以英文命名',
    },
  },
  {
    field: 'repeatSelect',
    label: '重复选择',
    required: true,
    component: 'RadioGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '按周', value: 1 },
        { label: '按日期', value: 0 },
      ],
    },
  },
  {
    field: 'repeat',
    label: '重复',
    required: true,
    ifShow: ({ values }) => {
      return !!values.repeatSelect;
    },
    component: 'CheckboxGroup',
    componentProps: {
      options: [
        { label: '周日', value: 0 },
        { label: '周一', value: 1 },
        { label: '周二', value: 2 },
        { label: '周三', value: 3 },
        { label: '周四', value: 4 },
        { label: '周五', value: 5 },
        { label: '周六', value: 6 },
      ],
    },
  },
  {
    field: 'handleDate',
    label: '关开机日期',
    required: true,
    component: 'Input',
    slot: 'customSlot',
    ifShow: ({ values }) => {
      return !values.repeatSelect;
    },
  },
  {
    field: 'shutTime',
    label: '关机时间',
    required: true,
    component: 'TimePicker',
  },
  {
    field: 'startTime',
    label: '开机时间',
    required: true,
    component: 'TimePicker',
  },
  {
    label: '可选机器',
    field: 'nodeIds',
    component: 'ApiSelect',
    componentProps: {
      api: async () => {
        const { list } = await getNodeList({ noPagination: true });
        const validList = list.filter((v) => {
          if (v.information && v.information.wake && v.information.wake.trim()) {
            const wakeStrs = v.information.wake.split('\n');
            const supportStr = wakeStrs[0].trim().charAt(wakeStrs[0].trim().length - 1);
            const wakeStr = wakeStrs[1].trim().charAt(wakeStrs[1].trim().length - 1);
            if (supportStr == 'g' && wakeStr == 'g') {
              return v;
            }
          }
        });
        return {
          list: validList,
        };
      },
      mode: 'multiple',
      showSearch: true,
      // 搜索过滤默认是以value来过滤的，若要使用其他(比如label)过滤，则使用optionFilterProp属性
      optionFilterProp: 'label',
      resultField: 'list',
      labelField: 'address',
      valueField: 'id',
    },
    required: true,
  },
  {
    field: 'status',
    label: '任务状态',
    required: true,
    component: 'RadioButtonGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 },
      ],
    },
  },
];
