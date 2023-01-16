<template>
  <div ref="container" class="monaco-editor" :style="`height: ${height}px`"></div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref, watch } from 'vue';
  import * as monaco from 'monaco-editor';

  let monacoDiffInstance: any = {};
  export default defineComponent({
    name: 'DiffEditor',
    props: {
      oldVal: {
        type: String,
        default: '',
      },
      newVal: {
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
    // emits: ['change'],
    setup(props) {
      const container: any = ref();

      watch(
        () => props.oldVal,
        () => {
          init();
        }
      );
      watch(
        () => props.newVal,
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
          // 编辑器主题：vs, hc-black, or vs-dark，更多选择详见官网
          theme: 'vs-dark',
          // 右侧不显示编辑器预览框
          roundedSelection: true,
          // 自动缩进
          autoIndent: true,
          // 是否只读
          readOnly: true,
          // 语言类型java,c,php更多选择详见官网
          language: props.fileType != '' ? props.fileType : 'javascript',
        };
        monacoDiffInstance = monaco.editor.createDiffEditor(container.value, defaultConfig);
        monacoDiffInstance.setModel({
          // oldValue为以前的值
          original: monaco.editor.createModel(props.oldVal, defaultConfig.language),
          // oldValue为新的值
          modified: monaco.editor.createModel(props.newVal, defaultConfig.language),
        });
      }
      return {
        container,
      };
    },
  });
</script>

<style scoped></style>
