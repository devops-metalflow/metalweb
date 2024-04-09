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
  import useClipboard from 'vue-clipboard3';

  const defaultConfig: any = {
    rows: 20,
    cols: 80,
    theme: {
      foreground: '#F8F8F8',
      background: '#2D2E2C',
      selection: '#5DA5D533',
      black: '#1E1E1D',
      brightBlack: '#262625',
      red: '#CE5C5C',
      brightRed: '#FF7272',
      green: '#5BCC5B',
      brightGreen: '#72FF72',
      yellow: '#CCCC5B',
      brightYellow: '#FFFF72',
      blue: '#5D5DD3',
      brightBlue: '#7279FF',
      magenta: '#BC5ED1',
      brightMagenta: '#E572FF',
      cyan: '#5DA5D5',
      brightCyan: '#72F0FF',
      white: '#F8F8F8',
      brightWhite: '#FFFFFF',
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
      const { toClipboard } = useClipboard();

      function connectWS(rows: number, cols: number) {
        let apiUrl = useGlobSetting().apiUrl;
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
          fontFamily: '"Cascadia Code", Menlo, monospace',
          cursorBlink: true, // 光标闪烁
          fontSize: 14,
          lineHeight: 1.1,
          // cursorStyle: 'underline', // 光标样式 underline
          allowProposedApi: true,
          // rightClickSelectsWord: true,
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

        term.writeln(
          [
            '',
            '',
            ' ┌──────────────────── \ud83d\udc96  \x1b[34m欢迎使用磐石远程终端\x1b[0m \ud83d\udc96  ─────────────────────┐',
            ' │                                                                     │',
            ' │                                                                     │',
            ` │               \ud83d\udc4f \ud83d\udc4f \ud83d\udc4f  \x1b[35;1m终端 \x1b[32m\x1b[3m${props.address}\x1b[0m \x1b[35;1m连接成功\x1b[0m \ud83d\udc4f \ud83d\udc4f \ud83d\udc4f                │`,
            ' │                                                                     │',
            ' │                                                                     │',
            ' │            \u231b \x1b[33;1m提示: \x1b[0m 超过 \x1b[31;1m2\x1b[0m 小时未活动，系统将自动断开               │',
            ' └─────────────────────────────────────────────────────────────────────┘',
            '',
          ].join('\n\r')
        );

        terminal.value = term;
        fit.value = fitAddon;
        fitAddon.fit();
        // terminal关联websocket
        connectWS(terminal.value.rows, terminal.value.cols);
        const attachAddon = new AttachAddon(wsConnect.value);
        term.loadAddon(attachAddon);
        term.loadAddon(new WebLinksAddon());
        term.loadAddon(new SearchAddon());

        term.onSelectionChange(() => {
          if (term.hasSelection()) {
            // Get the selected text
            const selectedText = term.getSelection();
            if (selectedText) {
              toClipboard(selectedText);
            }
          }
        });
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
