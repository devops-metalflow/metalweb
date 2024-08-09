<template>
  <div>
    <ConnectModal @register="registerConnectModal" @success="handleTerminal" />
  </div>
  <div class="container">
    <div v-if="pane.type === 'ssh'">
      <Tooltip v-if="isVisible" title="点击打开文件管理" placement="bottom">
        <div class="sftp-folder">
          <Badge
            :count="pane.address"
            :number-style="{
              fontSize: '16px',
              backgroundColor: '#d08c12',
              color: '#ffffff',
              boxShadow: '0 0 0 1px #d9d9d9 inset',
            }"
            @click="openFileManager(pane.connectId, pane.user, pane.address)"
          />
        </div>
      </Tooltip>
      <div class="terminal">
        <Terminal :address="pane.address" :sshId="pane.connectId" />
      </div>
      <FileMangerDrawer @register="registerDrawer" @close="closeDrawer" />
    </div>
    <div v-else-if="pane.type === 'vnc'">
      <VncViewer
        :address="pane.address"
        :vncId="pane.connectId"
        :port="pane.port"
        :password="pane.password"
      />
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import ConnectModal from './ConnectModal.vue';
  import Terminal from './Terminal.vue';
  import FileMangerDrawer from './FileDrawer.vue';
  import VncViewer from '/@/views/node/ssh/VncViewer.vue';
  import { useModal } from '/@/components/Modal';
  import { useDrawer } from '/@/components/Drawer';
  import { Tooltip, Badge } from 'ant-design-vue';

  export default defineComponent({
    name: 'Ssh',
    components: {
      Tooltip,
      Badge,
      ConnectModal,
      FileMangerDrawer,
      Terminal,
      VncViewer,
    },
    setup() {
      const [registerConnectModal, { openModal: openConnectModal }] = useModal();
      const pane = ref<{
        type: string;
        address: string;
        connectId: string;
        port: number;
        user?: string;
        password?: string;
        closable?: boolean;
      }>({ address: '', connectId: '', port: 0, type: '' });
      const activeKey = ref('');
      const isVisible = ref(true);

      function handleConnect() {
        try {
          const address = sessionStorage.getItem('address');
          console.log('address: ', address);
          openConnectModal(true, {
            address: address,
          });
        } catch (error) {}
      }

      function handleTerminal({ values, sshId }) {
        // 判断连接类型
        if (values.connectType == 'ssh') {
          pane.value = {
            type: values.connectType,
            address: values.address,
            port: values.sshPort,
            user: values.username,
            connectId: sshId,
            closable: true,
          };
          isVisible.value = true;
        } else {
          // 进行vnc连接
          let uuid = generateUUID();
          activeKey.value = uuid;
          pane.value = {
            type: values.connectType,
            address: values.address,
            port: values.vncPort,
            connectId: uuid,
            password: values.password,
            closable: true,
          };
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

      const [registerDrawer, { openDrawer }] = useDrawer();
      function openFileManager(sshId: string, user: string, address: string) {
        isVisible.value = false;
        openDrawer(true, {
          sshId,
          user,
          address,
        });
      }

      function closeDrawer() {
        isVisible.value = true;
      }

      onMounted(() => {
        handleConnect();
      });

      return {
        pane,
        isVisible,
        registerDrawer,
        openFileManager,
        handleTerminal,
        openConnectModal,
        registerConnectModal,
        closeDrawer,
      };
    },
  });
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    height: 100vh; /* 确保容器占满视口高度 */
    max-width: none;
  }

  .sftp-folder {
    position: absolute;
    right: 10px;
    z-index: 1000;
    top: 250px;
    cursor: pointer;
  }
  .terminal {
    height: 100vh;
  }
</style>
