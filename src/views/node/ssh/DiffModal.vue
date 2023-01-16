<template>
  <BasicModal
    v-bind="$attrs"
    :destroyOnClose="true"
    :useWrapper="true"
    :title="getTitle"
    width="100%"
    :defaultFullscreen="true"
    :showCancelBtn="false"
    :showOkBtn="false"
    @register="registerModal"
  >
    <BasicForm :showResetButton="false" :submitFunc="startDiff" @register="registerForm" />
    <DiffEditor
      v-if="newVal"
      ref="monaco"
      :old-val="oldVal"
      :new-val="newVal"
      :file-type="fileType"
      :height="1000"
    />
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import DiffEditor from './DiffEditor.vue';
  import { getFileContent, updateFile } from '/@/api/node/node';
  import { notification } from 'ant-design-vue';
  import { BasicForm, useForm } from '/@/components/Form';

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
    name: 'DiffModal',
    components: { BasicModal, DiffEditor, BasicForm },
    emits: ['success', 'register'],
    setup(_) {
      const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
        labelWidth: 100,
        schemas: [
          {
            field: 'oldValPath',
            label: '旧文件路径',
            colProps: { span: 8 },
            component: 'Input',
            required: true,
          },
          {
            field: 'newValPath',
            label: '新文件路径',
            colProps: { span: 8 },
            component: 'Input',
            required: true,
          },
        ],
        showActionButtonGroup: true,
      });

      const monaco = ref();
      const getTitle = ref<string>('');
      const sshId = ref<string>('');
      const oldVal = ref<string>('');
      const newVal = ref<string>('');
      const fileType = ref<string>('');
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        await resetFields();
        await setFieldsValue({
          ...data,
        });
        setModalProps({ confirmLoading: false });
        sshId.value = data.sshId;
        newVal.value = '';
      });

      async function startDiff() {
        const { oldValPath, newValPath } = await validate();
        // 得到文件后缀对应的语言类型
        if (newValPath.indexOf('.') != -1) {
          const extension = newValPath.split('.').pop().toLowerCase();
          if (languages.hasOwnProperty(extension)) {
            fileType.value = languages[extension];
          }
        }
        // 根据文件路径得到文件内容
        oldVal.value = await getFileContent({
          path: oldValPath,
          sshId: sshId.value,
        }).catch(() => {});
        newVal.value = await getFileContent({
          path: newValPath,
          sshId: sshId.value,
        }).catch(() => {});
      }

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
      return {
        monaco,
        registerModal,
        getTitle,
        fileType,
        oldVal,
        newVal,
        handleUpdate,
        registerForm,
        startDiff,
      };
    },
  });
</script>

<style scoped></style>
