<template>
  <BasicModal
    v-bind="$attrs"
    destroyOnClose
    @register="registerModal"
    title="远程粘贴"
    @ok="handleCopy"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { copySchema } from './ssh.data';

  export default defineComponent({
    name: 'CopyModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup: function (_, { emit }) {
      const [registerForm, { resetFields, validate }] = useForm({
        labelWidth: 100,
        schemas: copySchema,
        showSubmitButton: false,
        showResetButton: false,
      });

      const [registerModal, { closeModal }] = useModalInner(async () => {
        await resetFields();
      });

      async function handleCopy() {
        const values = await validate();
        const { text } = values;
        // 传递回去要粘贴的内容
        emit('success', { text: text });
        closeModal();
      }
      return { registerModal, registerForm, handleCopy, closeModal };
    },
  });
</script>

<style scoped></style>
