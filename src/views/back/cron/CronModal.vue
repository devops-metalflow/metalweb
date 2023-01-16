<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { formSchema } from './cron.data';
  import { createCronShutNode, updateCronShutNode } from '/@/api/back/cron';
  import moment from 'moment';

  export default defineComponent({
    name: 'CronModal',
    components: { BasicModal, BasicForm },
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
          });
        }
      });
      const getTitle = computed(() => (!unref(isUpdate) ? '新增任务' : '编辑任务'));

      async function handleSubmit() {
        try {
          let values = await validate();
          const { startTime, shutTime, repeat } = values;
          // 对获取的数据进行解析,将其转化为cron格式
          let week: string = repeat.join(',');
          setModalProps({ confirmLoading: true });
          const startConfig = `${startTime.seconds()} ${startTime.minutes()} ${startTime.hours()} * * ${week}`;
          const shutConfig = `${shutTime.seconds()} ${shutTime.minutes()} ${shutTime.hours()} * * ${week}`;
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
      return { registerModal, registerForm, getTitle, handleSubmit };
    },
  });
</script>

<style scoped></style>
