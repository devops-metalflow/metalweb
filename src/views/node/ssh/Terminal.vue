<template>
  <div :id="sshId"></div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
  import { Terminal } from 'xterm';
  import 'xterm/css/xterm.css';
  import { FitAddon } from 'xterm-addon-fit';
  import { WebLinksAddon } from 'xterm-addon-web-links';
  import { SearchAddon } from 'xterm-addon-search';
  import { AttachAddon } from 'xterm-addon-attach';
  import { getToken } from '/@/utils/auth';
  import { useGlobSetting } from '/@/hooks/setting';
  import { resizeShell } from '/@/api/node/node';

  const defaultConfig: any = {
    rows: 20,
    cols: 80,
    theme: {
      foreground: '#ebeef5',
      background: '#1d2935',
      cursor: '#e6a23c',
      black: '#000000',
      brightBlack: '#555555',
      red: '#ef4f4f',
      brightRed: '#ef4f4f',
      green: '#67c23a',
      brightGreen: '#67c23a',
      yellow: '#e6a23c',
      brightYellow: '#e6a23c',
      blue: '#34657b',
      brightBlue: '#409eff',
      magenta: '#ef4f4f',
      brightMagenta: '#ef4f4f',
      cyan: '#17c0ae',
      brightCyan: '#17c0ae',
      white: '#a6e22b',
      brightWhite: '#ffffff',
    },
  };

  export default defineComponent({
    name: 'Terminal',
    props: {
      address: {
        type: String,
        default: '',
      },
      sshId: {
        type: String,
        default: '',
      },
    },
    emits: ['exit'],
    setup(props, { emit }) {
      // 创建websocket
      const wsConnect = ref();
      const terminal = ref();
      const fit = ref();

      function connectWS(rows: number, cols: number) {
        let apiUrl = useGlobSetting().apiUrl;
        console.log('apiUrl: ', apiUrl);
        let wsUrl =
          apiUrl.search('https') == -1
            ? apiUrl.replace('http', 'ws')
            : apiUrl.replace('https', 'wss');
        // 定义websocket
        const ws = new WebSocket(
          wsUrl +
            '/node/shell/ws?sshId=' +
            encodeURIComponent(props.sshId) +
            '&address=' +
            props.address +
            '&rows=' +
            rows +
            '&cols=' +
            cols +
            '&token=' +
            getToken()
        );
        ws.onmessage = function (evt) {
          // 输入exit则退出Terminal
          if (evt.data == '\r\nlogout\r\n') {
            ws.close();
            emit('exit');
          }
        };
        wsConnect.value = ws;
      }

      function runTerminal() {
        const term = new Terminal({
          rendererType: 'canvas', // 渲染类型
          convertEol: true, // 启用时，光标将设置为下一行的开头
          // scrollback: 800, // 终端中的回滚量
          disableStdin: false, // 是否应禁用输入
          fontSize: 16,
          fontFamily: 'monospace',
          cursorBlink: true, // 光标闪烁
          cursorStyle: 'underline', // 光标样式 underline
          theme: defaultConfig.theme,
        });
        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        // 将terminal实例挂载到dom
        let connectTabElement = document.getElementById(props.sshId);
        if (!connectTabElement) {
          return;
        }
        term.open(connectTabElement);
        connectTabElement.style.height = Math.floor(window.innerHeight - 5) + 'px';
        term.focus();

        terminal.value = term;
        fit.value = fitAddon;
        fitAddon.fit();
        // terminal关联websocket
        connectWS(terminal.value.rows, terminal.value.cols);
        const attachAddon = new AttachAddon(wsConnect.value);
        term.loadAddon(attachAddon);
        term.loadAddon(new WebLinksAddon());
        term.loadAddon(new SearchAddon());
      }

      function resizeTerminal() {
        let connectTabElement = document.getElementById(props.sshId);
        if (!connectTabElement) {
          return;
        }
        connectTabElement.style.height = Math.floor(window.innerHeight - 5) + 'px';
        fit.value.fit();
        if (
          defaultConfig.rows !== terminal.value.rows ||
          defaultConfig.cols !== terminal.value.cols
        ) {
          resizeShell({
            sshId: props.sshId,
            high: terminal.value.rows,
            width: terminal.value.cols,
          }).catch(() => {});
        }
        defaultConfig.rows = terminal.value.rows;
        defaultConfig.cols = terminal.value.cols;
      }
      // 初始化Terminal
      const init = () => {
        runTerminal();
      };

      onMounted(() => {
        init();
        window.onresize = resizeTerminal;
      });

      onUnmounted(() => {
        // 断开websocket连接
        if (wsConnect.value) {
          terminal.value.dispose();
          fit.value.dispose();
          wsConnect.value.close();
        }
      });
    },
  });
</script>

<style></style>
