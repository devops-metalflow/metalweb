<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="title" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { EditFormSchema } from '../my.data';
  import { updateCollect } from '/@/api/collect/collect';

  export default defineComponent({
    name: 'EditModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const collectionId = ref<number>(0);
      const title = ref<string>('');
      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        schemas: EditFormSchema,
        showActionButtonGroup: false,
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        await resetFields();
        await setFieldsValue({
          ...data,
        });
        setModalProps({ confirmLoading: false });
        collectionId.value = data.collectionId;
        title.value = `请输入机器${data.address}的描述`;
      });

      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          await updateCollect(collectionId.value, {
            ...values,
          });
          closeModal();
          setModalProps({ confirmLoading: false });
          emit('success');
        } catch (e) {
          closeModal();
          setModalProps({ confirmLoading: false });
        }
      }
      return { registerModal, registerForm, handleSubmit, title };
    },
  });
</script>

<style scoped></style>
