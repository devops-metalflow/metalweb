<template>
  <div style="background-color: #ffffff">
    <div>
      <BasicForm @register="register" />
    </div>
    <div>
      <Tabs v-model:activeKey="activeKey" hide-add type="editable-card" @edit="onEdit">
        <TabPane v-for="pane in panes" :key="pane.connectId" :closable="pane.closable">
          <template v-if="pane.type === 'ssh'" #tab>
            <Icon
              icon="files-svg|svg"
              :size="20"
              @click="openFileManager(pane.connectId, pane.user, pane.address)"
            />
            <Popover placement="bottomRight">
              <template #content>
                <div style="width: 200px">
                  <Input addon-before="session" :value="pane.connectId" size="small" disabled />
                  <Input addon-before="端口" :value="pane.port" size="small" disabled />
                  <Input addon-before="用户" :value="pane.user" size="small" disabled />
                </div>
              </template>
              <span>
                {{ pane.address }}
              </span>
            </Popover>
          </template>
          <template v-else #tab>
            <span>
              {{ pane.address }}
            </span>
          </template>
          <Terminal v-if="pane.type === 'ssh'" :address="pane.address" :sshId="pane.connectId" />
          <VncViewer
            v-else
            :address="pane.address"
            :vncId="pane.connectId"
            :port="pane.port"
            :password="pane.password"
            @fail="handleVncFail"
          /> </TabPane
      ></Tabs>
    </div>
    <ConnectModal @register="registerConnectModal" @success="handleTerminal" />
    <FileManagerModal @register="registerFileManagerModal" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { Icon } from '/@/components/Icon';
  import { Tabs, Popover, Input } from 'ant-design-vue';
  import TabPane from 'ant-design-vue/lib/vc-tabs/src/TabPane';
  import ConnectModal from './ConnectModal.vue';
  import Terminal from './Terminal.vue';
  import VncViewer from '/@/views/node/ssh/VncViewer.vue';
  import FileManagerModal from './FileManagerModal.vue';
  import { useModal } from '/@/components/Modal';
  import { getNodeList } from '/@/api/node/node';
  import { useRoute } from 'vue-router';

  export default defineComponent({
    name: 'Ssh',
    components: {
      BasicForm,
      ConnectModal,
      FileManagerModal,
      Terminal,
      VncViewer,
      Tabs,
      TabPane,
      Icon,
      Popover,
      Input,
    },
    setup() {
      const [registerConnectModal, { openModal: openConnectModal }] = useModal();
      const panes = ref<
        {
          type: string;
          address: string;
          connectId: string;
          port: number;
          user?: string;
          password?: string;
          closable?: boolean;
        }[]
      >([]);
      const activeKey = ref('');

      const router = useRoute();
      const { address } = router.query;

      const sshSchema: FormSchema[] = [
        {
          label: '终端',
          field: 'address',
          component: 'ApiSelect',
          colProps: { span: 8 },
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
          defaultValue: address,
        },
      ];

      const [register, { validate }] = useForm({
        labelWidth: 50,
        schemas: sshSchema,
        actionColOptions: {
          span: 2,
        },
        showResetButton: false,
        submitButtonOptions: {
          text: '连接',
        },
        submitFunc: handleConnect,
      });
      async function handleConnect() {
        try {
          const value = await validate();
          openConnectModal(true, {
            value,
          });
        } catch (error) {}
      }

      function handleTerminal({ values, sshId }) {
        // 判断连接类型
        if (values.connectType == 'ssh') {
          // 若连接成功，则发出websocket连接，并显示terminal
          activeKey.value = sshId;
          panes.value.push({
            type: values.connectType,
            address: values.address,
            port: values.sshPort,
            user: values.username,
            connectId: sshId,
            closable: true,
          });
        } else {
          // 进行vnc连接
          let uuid = generateUUID();
          activeKey.value = uuid;
          panes.value.push({
            type: values.connectType,
            address: values.address,
            port: values.vncPort,
            connectId: uuid,
            password: values.password,
            closable: true,
          });
        }
      }

      function generateUUID() {
        // Public Domain/MIT
        var d = new Date().getTime(); //Timestamp
        var d2 =
          (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0; //Time in microseconds since page-load or 0 if unsupported
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = Math.random() * 16; //random number between 0 and 16
          if (d > 0) {
            //Use timestamp until depleted
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
          } else {
            //Use microseconds since page-load if supported
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
          }
          return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
        });
      }

      const remove = (targetKey: string) => {
        let lastIndex = 0;
        panes.value.forEach((pane, i) => {
          if (pane.connectId === targetKey) {
            lastIndex = i - 1;
          }
        });
        panes.value = panes.value.filter((pane) => pane.connectId !== targetKey);
        if (panes.value.length && activeKey.value === targetKey) {
          if (lastIndex >= 0) {
            activeKey.value = panes.value[lastIndex].connectId;
          } else {
            activeKey.value = panes.value[0].connectId;
          }
        }
      };

      function handleVncFail({ vncId }) {
        remove(vncId);
      }

      const onEdit = (targetKey: string) => {
        remove(targetKey);
      };

      const [registerFileManagerModal, { openModal: openFileManagerModal }] = useModal();
      function openFileManager(sshId: string, user: string, address: string) {
        openFileManagerModal(true, {
          sshId,
          user,
          address,
        });
      }

      return {
        register,
        panes,
        onEdit,
        activeKey,
        registerFileManagerModal,
        openFileManagerModal,
        openFileManager,
        handleTerminal,
        handleVncFail,
        registerConnectModal,
      };
    },
  });
</script>
