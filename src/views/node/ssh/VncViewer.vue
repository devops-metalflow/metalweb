<template>
  <div v-if="isConnected">
    <a-button-group>
      <a-button type="primary" @click="copy">粘贴板</a-button>
      <a-button type="primary" @click="ctrlAltDel">CTRL+ALT+DEL</a-button>
    </a-button-group>
  </div>
  <CopyModal @register="registerCopyModal" @success="handleCopy" />
  <div :id="vncId" style="width: 100%; margin-bottom: 5px"></div>
</template>

<script>
  import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
  import { useGlobSetting } from '/@/hooks/setting';
  import { getToken } from '/@/utils/auth';
  import RFB from '@novnc/novnc/core/rfb';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useModal } from '/@/components/Modal';
  import CopyModal from '/@/views/node/ssh/CopyModal.vue';

  export default defineComponent({
    name: 'Terminal',
    components: { CopyModal },
    props: {
      address: {
        type: String,
        default: '',
      },
      vncId: {
        type: String,
        default: '',
      },
      port: {
        type: Number,
        default: 5901,
      },
      password: {
        type: String,
        default: '',
      },
    },
    emits: ['fail'],
    setup(props, { emit }) {
      const isConnected = ref(false);
      const rfb = ref();
      const { notification } = useMessage();
      const [registerCopyModal, { openModal: openCopyModal }] = useModal();

      function connectVnc() {
        let apiUrl = useGlobSetting().apiUrl;
        let vncUrlHeader =
          apiUrl.search('https') === -1
            ? apiUrl.replace('http', 'ws')
            : apiUrl.replace('https', 'wss');
        let vncUrl =
          vncUrlHeader +
          '/node/vnc/ws?address=' +
          props.address +
          '&port=' +
          props.port +
          '&token=' +
          getToken();
        let vncElement = document.getElementById(props.vncId);
        vncElement.style.height = Math.floor(window.innerHeight - 10) + 'px';
        let rfbViewer = new RFB(vncElement, vncUrl, {
          credentials: { password: props.password },
        });
        rfbViewer.addEventListener('connect', connectedToServer);
        rfbViewer.addEventListener('disconnect', disconnectedFromServer);
        rfbViewer.addEventListener('securityfailure', errorPassword);
        rfbViewer.scaleViewport = true;
        rfbViewer.resizeSession = true;
        rfbViewer.showDotCursor = true;

        rfb.value = rfbViewer;
      }

      function disconnectedFromServer() {
        isConnected.value = false;
        notification.info({
          message: '已断开连接',
          duration: 1,
        });
        emit('fail', { vncId: props.vncId });
      }
      function errorPassword() {
        isConnected.value = false;
        notification.error({
          message: 'vnc连接密码错误，请重新尝试',
          duration: 5,
        });
        emit('fail', { vncId: props.vncId });
      }

      function connectedToServer() {
        isConnected.value = true;
        notification.success({
          message: '恭喜，连接成功',
          duration: 3,
        });
      }

      function copy() {
        openCopyModal(true);
      }

      function ctrlAltDel() {
        rfb.value.sendCtrlAltDel();
      }

      function handleCopy({ text }) {
        const str = String(text);
        console.log('str:-0-->', str);
        rfb.value.clipboardPasteFrom(str);
        setTimeout(() => {
          for (let i = 0, len = str.length; i < len; i++) {
            rfb.value.sendKey(str.charCodeAt(i));
          }
        }, 100);
      }
      // 初始化Terminal
      const init = () => {
        connectVnc();
      };

      onMounted(() => {
        init();
      });

      onUnmounted(() => {
        // 断开websocket连接
        if (rfb.value) {
          rfb.value.disconnect();
        }
      });
      return {
        registerCopyModal,
        copy,
        isConnected,
        handleCopy,
        ctrlAltDel,
      };
    },
  });
</script>

<style scoped></style>
