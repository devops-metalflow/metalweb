<template>
  <BasicModal
    v-bind="$attrs"
    destroyOnClose
    @register="registerModal"
    :title="getTitle"
    :showOkBtn="false"
    :showCancelBtn="false"
    @ok="handleConnect"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { connectSchema } from './ssh.data';
  import { nodeShellConnect } from '/@/api/node/node';
  import { notification } from 'ant-design-vue';

  export default defineComponent({
    name: 'ConnectModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup: function (_, { emit }) {
      const getTitle = ref<string>('');

      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 100,
        schemas: connectSchema,
        actionColOptions: {
          span: 23,
        },
        showSubmitButton: true,
        showResetButton: false,
        submitButtonOptions: {
          text: '连接',
        },
        submitFunc: () => handleConnect(),
        autoSubmitOnEnter: true,
      });

      const [registerModal, { closeModal }] = useModalInner(async (data) => {
        await resetFields();
        getTitle.value = `远程连接${data.value.address}`;
        await setFieldsValue({
          ...data.value,
        });
      });

      async function handleConnect() {
        const values = await validate();
        const { address, sshPort, username, password, connectType } = values;
        // 先判断连接类型
        if (connectType == 'ssh') {
          // 进行ssh连接测试
          nodeShellConnect({
            address: address,
            sshPort: sshPort,
            username: username,
            password: password,
          })
            .then((v) => {
              // 将得到的sshId传递回去
              emit('success', { values: { ...values }, sshId: v });
            })
            .catch((e) => {
              notification.error({
                message: '连接失败，请检查账户名或密码',
                description: e,
                duration: 5,
              });
            });
          closeModal();
        } else {
          // 进行vnc连接测试
          emit('success', { values: { ...values } });
          closeModal();
        }
      }
      return { registerModal, registerForm, getTitle, handleConnect, closeModal };
    },
  });
</script>

<style scoped></style>
