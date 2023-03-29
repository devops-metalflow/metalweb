<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm">
      <template #customSlot="{ model, field }">
        <RangePicker v-model:value="model[field]" :placeholder="['关机日期', '开机日期']">
          <template #dateRender="{ current }">
            <div class="ant-calendar-date" :style="getCurrentStyle(current)">
              {{ current.date() }}
            </div>
          </template>
          <template #renderExtraFooter>红色标记为节假日</template>
        </RangePicker>
      </template>
    </BasicForm>
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { formSchema } from './cron.data';
  import { createCronShutNode, updateCronShutNode } from '/@/api/back/cron';
  import moment from 'moment';
  import { Moment } from 'moment';
  import { RangePicker } from 'ant-design-vue/lib/date-picker/index';
  import type { CSSProperties } from 'vue';
  import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';

  export default defineComponent({
    name: 'CronModal',
    components: { BasicModal, BasicForm, RangePicker },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref<number>(0);

      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 100,
        schemas: formSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        await resetFields();
        setModalProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;

        if (unref(isUpdate)) {
          rowId.value = data.record.id;
          let values = data.record;
          // 将值解析转化
          let startTimeStrs = values.startTime.split(' ');
          let shutTimeStrs = values.shutTime.split(' ');
          let repeat = shutTimeStrs[shutTimeStrs.length - 1].split(',').map((v) => {
            return parseInt(v);
          });
          let shutTime = moment(
            `${shutTimeStrs[2]}:${shutTimeStrs[1]}:${shutTimeStrs[0]}`,
            'kk:mm:ss'
          );
          let startTime = moment(
            `${startTimeStrs[2]}:${startTimeStrs[1]}:${startTimeStrs[0]}`,
            'kk:mm:ss'
          );

          // 判断是按照日期还是按照周设置的定时
          let handleDate: Moment[] = [moment(), moment()];
          let repeatSelect = 1;
          if (shutTimeStrs[shutTimeStrs.length - 1] == '*') {
            // 按照日期
            let year = new Date().getFullYear();
            let shutDate = moment(`${year}-${shutTimeStrs[4]}-${shutTimeStrs[3]}`, 'YYYY-MM-DD');
            let startDate = moment(`${year}-${startTimeStrs[4]}-${startTimeStrs[3]}`, 'YYYY-MM-DD');
            handleDate = [shutDate, startDate];
            repeatSelect = 0;
          }

          let nodeIds: number[] = [];
          values.nodes.forEach((v) => {
            nodeIds.push(v.id);
          });
          await setFieldsValue({
            ...data.record,
            startTime: startTime,
            shutTime: shutTime,
            repeat,
            nodeIds,
            handleDate,
            repeatSelect,
          });
        }
      });
      const getTitle = computed(() => (!unref(isUpdate) ? '新增任务' : '编辑任务'));

      const getCurrentStyle = (current: Moment) => {
        const style: CSSProperties = {};
        // 获取2023法定节假日https://cdn.jsdelivr.net/gh/NateScarlet/holiday-cn@master/{year}.json
        const offDays = [
          '2022-12-31',
          '2023-01-01',
          '2023-01-02',
          '2023-01-21',
          '2023-01-22',
          '2023-01-23',
          '2023-01-24',
          '2023-01-25',
          '2023-01-26',
          '2023-01-27',
          '2023-04-05',
          '2023-04-29',
          '2023-04-30',
          '2023-05-01',
          '2023-05-02',
          '2023-05-03',
          '2023-06-22',
          '2023-06-23',
          '2023-06-24',
          '2023-09-29',
          '2023-09-30',
          '2023-10-01',
          '2023-10-02',
          '2023-10-03',
          '2023-10-04',
          '2023-10-05',
          '2023-10-06',
        ];

        if (offDays.indexOf(current.format('YYYY-MM-DD')) != -1) {
          style.border = '1px solid #fc2929';
          style.borderRadius = '50%';
        }

        return style;
      };

      async function handleSubmit() {
        try {
          let values = await validate();
          const { startTime, shutTime, repeatSelect, handleDate, repeat } = values;
          let startConfig = `${startTime.seconds()} ${startTime.minutes()} ${startTime.hours()}`;
          let shutConfig = `${shutTime.seconds()} ${shutTime.minutes()} ${shutTime.hours()}`;
          if (repeatSelect == 1) {
            // 对获取的数据进行解析,将其转化为cron格式
            let week: string = repeat.join(',');
            setModalProps({ confirmLoading: true });
            startConfig = `${startConfig} * * ${week}`;
            shutConfig = `${shutConfig} * * ${week}`;
          } else {
            // 设置为日期类型的重复
            let shutMonth = parseInt(handleDate[0].get('month')) + 1;
            let shutDay = parseInt(handleDate[0].get('date'));
            let startMonth = parseInt(handleDate[1].get('month')) + 1;
            let startDay = parseInt(handleDate[1].get('date'));

            startConfig = `${startConfig} ${startDay} ${startMonth} *`;
            shutConfig = `${shutConfig} ${shutDay} ${shutMonth} *`;
          }

          values = {
            ...values,
            startTime: startConfig,
            shutTime: shutConfig,
          };
          if (isUpdate.value) {
            await updateCronShutNode(rowId.value, values);
          } else {
            await createCronShutNode(values);
          }
          closeModal();
          emit('success', { isUpdate: unref(isUpdate), values: { ...values, id: rowId.value } });
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }
      return { registerModal, registerForm, getTitle, handleSubmit, getCurrentStyle, locale };
    },
  });
</script>

<style scoped></style>
