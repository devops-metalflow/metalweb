<template>
  <div>
    <ConnectModal @register="registerConnectModal" @success="handleTerminal" />
  </div>
  <div class="container">
    <div v-if="pane.type === 'ssh'">
      <div class="toolbar">
        <ul class="styled-list">
          <li
            ><a
              ><Icon
                icon="folder|svg"
                size="20"
                @click="openFileManager(pane.connectId, pane.user, pane.address)" /></a
          ></li>
        </ul>
      </div>
      <div class="terminal">
        <Terminal :address="pane.address" :sshId="pane.connectId" />
      </div>
      <FileMangerDrawer @register="registerDrawer" />
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
  import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
  import ConnectModal from './ConnectModal.vue';
  import Terminal from './Terminal.vue';
  import FileMangerDrawer from './FileDrawer.vue';
  import VncViewer from '/@/views/node/ssh/VncViewer.vue';
  import { useModal } from '/@/components/Modal';
  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
  import { useMultipleTabSetting } from '/@/hooks/setting/useMultipleTabSetting';
  import { triggerWindowResize } from '/@/utils/event';
  import { TriggerEnum } from '/@/enums/menuEnum';
  import { Icon } from '/@/components/Icon';
  import { useDrawer } from '/@/components/Drawer';

  export default defineComponent({
    name: 'Ssh',
    components: {
      Icon,
      ConnectModal,
      FileMangerDrawer,
      Terminal,
      VncViewer,
    },
    setup() {
      const { setMenuSetting } = useMenuSetting();
      const { setHeaderSetting } = useHeaderSetting();
      const { setMultipleTabSetting } = useMultipleTabSetting();
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
        openDrawer(true, {
          sshId,
          user,
          address,
        });
      }

      onMounted(() => {
        handleConnect();
        setMenuSetting({
          show: false,
          trigger: TriggerEnum.NONE,
        });
        setHeaderSetting({ show: false });
        setMultipleTabSetting({ show: false });
        triggerWindowResize();
      });
      onUnmounted(() => {
        setMenuSetting({
          show: true,
          trigger: TriggerEnum.NONE,
        });
        setHeaderSetting({ show: true });
        setMultipleTabSetting({ show: true });
      });

      return {
        pane,
        registerDrawer,
        openFileManager,
        handleTerminal,
        openConnectModal,
        registerConnectModal,
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

  .toolbar {
    position: fixed;
    top: 0;
    background-color: #f1f2f5;
    width: 100%; /* 或者您想要的宽度 */
    z-index: 1000; /* 确保按钮排在其他内容之上 */
  }
  .terminal {
    flex: 1; /* 让终端部分占据剩余空间 */
    overflow: auto; /* 允许滚动 */
    padding-top: 5px;
  }
  /* 为具有 'styled-list' 类的 <ul> 增加间隔 */
  .styled-list {
    list-style-type: none; /* 移除默认的列表标记 */
    padding-left: 10px; /* 移除默认的左内边距 */
    margin-bottom: 0;
  }

  .styled-list li {
    padding: 5px 0; /* 增加列表项的上下内边距 */
    border-bottom: 1px solid #ccc; /* 为每个列表项添加底部边框 */
  }

  /* 最后一个列表项不需要底部边框 */
  .styled-list li:last-child {
    border-bottom: none; /* 移除最后一个列表项的底部边框 */
  }
</style>
