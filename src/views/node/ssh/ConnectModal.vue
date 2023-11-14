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
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { getNodeList, nodeShellConnect } from '/@/api/node/node';
  import { notification } from 'ant-design-vue';

  export default defineComponent({
    name: 'ConnectModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup: function (_, { emit }) {
      const getTitle = ref<string>('');

      const connectSchema: FormSchema[] = [
        {
          label: '终端',
          field: 'address',
          component: 'ApiSelect',
          // colProps: { span: 8 },
          componentProps: {
            api: () => {
              return getNodeList({ noPagination: true });
            },
            resultField: 'list',
            labelField: 'address',
            valueField: 'address',
            showSearch: true,
          },
          required: true,
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
        getTitle.value = '远程连接';
        await setFieldsValue({
          ...data,
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
