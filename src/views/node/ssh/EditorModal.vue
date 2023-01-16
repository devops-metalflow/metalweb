<template>
  <BasicModal
    v-bind="$attrs"
    :destroyOnClose="true"
    :useWrapper="true"
    :title="getTitle"
    width="100%"
    :defaultFullscreen="true"
    :showCancelBtn="false"
    okText="保存"
    @ok="handleUpdate"
    @register="registerModal"
  >
    <FileEditor
      v-if="fileContent"
      ref="monaco"
      :val="fileContent"
      :file-type="fileType"
      :height="1000"
    />
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import FileEditor from './FileEditor.vue';
  import { getFileContent, updateFile } from '/@/api/node/node';
  import { notification } from 'ant-design-vue';

  const languages: any = {
    apex: 'apex',
    azcli: 'azcli',
    bat: 'bat',
    c: 'c',
    clojure: 'clojure',
    coffeescript: 'coffeescript',
    cpp: 'cpp',
    csharp: 'csharp',
    csp: 'csp',
    css: 'css',
    csv: 'csv',
    dockerfile: 'dockerfile',
    fsharp: 'fsharp',
    go: 'go',
    graphql: 'graphql',
    handlebars: 'handlebars',
    html: 'html',
    ini: 'ini',
    java: 'java',
    js: 'javascript',
    json: 'json',
    kotlin: 'kotlin',
    less: 'less',
    lua: 'lua',
    md: 'markdown',
    msdax: 'msdax',
    pascal: 'pascal',
    perl: 'perl',
    pgsql: 'pgsql',
    php: 'php',
    plaintext: 'plaintext',
    postiats: 'postiats',
    powerquery: 'powerquery',
    powershell: 'powershell',
    pug: 'pug',
    py: 'python',
    r: 'r',
    razor: 'razor',
    redis: 'redis',
    redshift: 'redshift',
    ruby: 'ruby',
    rust: 'rust',
    sb: 'sb',
    scheme: 'scheme',
    scss: 'scss',
    shell: 'shell',
    sh: 'shell',
    sol: 'sol',
    sql: 'sql',
    st: 'st',
    swift: 'swift',
    tcl: 'tcl',
    typescript: 'typescript',
    vb: 'vb',
    xml: 'xml',
    yml: 'yaml',
    yaml: 'yaml',
  };

  export default defineComponent({
    name: 'EditorModal',
    components: { BasicModal, FileEditor },
    emits: ['success', 'register'],
    setup(_) {
      const monaco = ref();
      const getTitle = ref<string>('');
      const sshId = ref<string>('');
      const fileContent = ref<string>('');
      const fileType = ref<string>('');
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        setModalProps({ confirmLoading: false });
        getTitle.value = data.filepath;
        sshId.value = data.sshId;
        // 得到文件后缀对应的语言类型
        if (data.filepath.indexOf('.') != -1) {
          const extension = data.filepath.split('.').pop().toLowerCase();
          if (languages.hasOwnProperty(extension)) {
            fileType.value = languages[extension];
          }
        }
        fileContent.value = await getFileContent({
          path: data.filepath,
          sshId: data.sshId,
        });
      });

      function handleUpdate() {
        setModalProps({ confirmLoading: true });
        updateFile({
          path: getTitle.value,
          content: monaco.value.getVal(),
          sshId: sshId.value,
        })
          .then((v) => {
            notification.success({
              message: '完成',
              description: v,
              duration: 3,
            });
            setModalProps({ confirmLoading: false });
          })
          .catch((e) => {
            notification.error({
              message: '失败',
              description: e,
              duration: 3,
            });
            setModalProps({ confirmLoading: false });
          });
        closeModal();
      }
      return { monaco, registerModal, fileContent, getTitle, fileType, handleUpdate };
    },
  });
</script>

<style scoped></style>
