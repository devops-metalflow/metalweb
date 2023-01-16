<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="创建机器节点" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { AddFormSchema } from '/@/views/node/list/list.data';
  import { createNode } from '/@/api/node/node';

  export default defineComponent({
    name: 'AddModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const [registerForm, { resetFields, validate }] = useForm({
        labelWidth: 100,
        schemas: AddFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async () => {
        await resetFields();
      });

      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          await createNode({
            ...values,
            // 默认创建的机器节点都是性能低，运行异常的，因为并没有做连接检查。
            performance: 1,
            health: 1,
          });
          closeModal();
          setModalProps({ confirmLoading: false });
          emit('success');
        } catch (e) {
          closeModal();
          setModalProps({ confirmLoading: false });
          emit('success');
        }
      }
      return { registerModal, registerForm, handleSubmit };
    },
  });
</script>

<style scoped></style>
