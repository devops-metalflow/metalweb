<template>
  <div ref="container" class="monaco-editor" :style="`height: ${height}px`"></div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref, watch } from 'vue';
  import * as monaco from 'monaco-editor';

  let monacoEditor: any = {};
  export default defineComponent({
    name: 'FileEditor',
    props: {
      val: {
        type: String,
        default: '',
      },
      fileType: {
        type: String,
        default: '',
      },
      height: {
        type: Number,
        default: 300,
      },
    },
    emits: ['change'],
    setup(props, { emit }) {
      const container: any = ref();

      watch(
        () => props.val,
        () => {
          init();
        }
      );

      onMounted(() => {
        init();
      });

      function init() {
        container.value.innerHTML = '';
        // 生成编辑器配置
        const defaultConfig: any = {
          // 编辑器的值
          value: props.val,
          // 编辑器主题：vs, hc-black, or vs-dark，更多选择详见官网
          theme: 'vs-dark',
          // 右侧不显示编辑器预览框
          roundedSelection: true,
          // 自动缩进
          autoIndent: true,
          // 是否只读
          readOnly: false,
          // 语言类型java,c,php更多选择详见官网
          language: props.fileType != '' ? props.fileType : 'javascript',
        };
        monacoEditor = monaco.editor.create(container.value, defaultConfig);
        monacoEditor.onDidChangeModelContent(() => {
          emit('change', monacoEditor.getValue());
        });
      }
      const getVal = () => {
        return monacoEditor.getValue();
      };
      return {
        getVal,
        container,
      };
    },
  });
</script>

<style scoped></style>
