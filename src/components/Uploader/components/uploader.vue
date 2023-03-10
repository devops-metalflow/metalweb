<template>
  <div class="uploader">
    <slot :files="files" :file-list="fileList" :started="started">
      <uploader-unsupport />
      <uploader-drop>
        <p>Drop files here to upload or</p>
        <uploader-btn>select files</uploader-btn>
        <uploader-btn :directory="true">select folder</uploader-btn>
      </uploader-drop>
      <uploader-list />
    </slot>
  </div>
</template>

<script>
  import { provide, ref, reactive, onUnmounted, getCurrentInstance } from 'vue';
  import Uploader from 'simple-uploader.js';
  import { kebabCase } from '../common/utils';
  import UploaderBtn from './btn.vue';
  import UploaderDrop from './drop.vue';
  import UploaderUnsupport from './unsupport.vue';
  import UploaderList from './list.vue';
  import UploaderFiles from './files.vue';
  import UploaderFile from './file.vue';

  const COMPONENT_NAME = 'uploader';
  const FILE_ADDED_EVENT = 'fileAdded';
  const FILES_ADDED_EVENT = 'filesAdded';
  const UPLOAD_START_EVENT = 'uploadStart';

  export default {
    name: COMPONENT_NAME,
    components: {
      UploaderBtn,
      UploaderDrop,
      UploaderUnsupport,
      UploaderList,
      // eslint-disable-next-line vue/no-unused-components
      UploaderFiles,
      // eslint-disable-next-line vue/no-unused-components
      UploaderFile,
    },
    props: {
      options: {
        type: Object,
        default() {
          return {};
        },
      },
      autoStart: {
        type: Boolean,
        default: true,
      },
      fileStatusText: {
        type: [Object, Function],
        default() {
          return {
            success: 'success',
            error: 'error',
            uploading: 'uploading',
            paused: 'paused',
            waiting: 'waiting',
          };
        },
      },
    },
    setup(props, { emit }) {
      const uploaderList = ref(null);
      const started = ref(false);
      const files = ref([]);
      const fileList = ref([]);
      const instance = getCurrentInstance();
      let uploader = new Uploader(props.options);
      const uploadStart = () => {
        started.value = true;
      };
      const fileAdded = (file) => {
        emit(kebabCase(FILE_ADDED_EVENT), file);
        if (file.ignored) {
          // is ignored, filter it
          return false;
        }
      };
      const filesAdded = (files, fileList) => {
        emit(kebabCase(FILES_ADDED_EVENT), files, fileList);
        if (files.ignored || fileList.ignored) {
          // is ignored, filter it
          return false;
        }
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
      const fileRemoved = (fi) => {
        files.value = uploader.files;
        fileList.value = uploader.fileList;
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
      const filesSubmitted = (fi, flist) => {
        files.value = uploader.files;
        fileList.value = uploader.fileList;
        if (props.autoStart) {
          uploader.upload();
        }
      };
      const allEvent = (...args) => {
        const name = args[0];
        const EVENTSMAP = {
          [FILE_ADDED_EVENT]: true,
          [FILES_ADDED_EVENT]: true,
          [UPLOAD_START_EVENT]: 'uploadStart',
        };
        const handler = EVENTSMAP[name];
        if (handler) {
          if (handler === true) {
            return;
          }
          instance.setupState[handler].apply(instance.setupState[handler], args.slice(1));
        }
        args[0] = kebabCase(name);
        emit.apply(instance.setupState, args);
      };

      // eslint-disable-next-line vue/no-mutating-props
      props.options.initialPaused = !props.autoStart;
      // eslint-disable-next-line vue/no-setup-props-destructure
      uploader.fileStatusText = props.fileStatusText;
      uploader.on('catchAll', allEvent);
      uploader.on(FILE_ADDED_EVENT, fileAdded);
      uploader.on(FILES_ADDED_EVENT, filesAdded);
      uploader.on('fileRemoved', fileRemoved);
      uploader.on('filesSubmitted', filesSubmitted);
      uploader[UPLOAD_START_EVENT] = uploadStart;

      onUnmounted(() => {
        uploader.off('catchAll', allEvent);
        uploader.off(FILE_ADDED_EVENT, fileAdded);
        uploader.off(FILES_ADDED_EVENT, filesAdded);
        uploader.off('fileRemoved', fileRemoved);
        uploader.off('filesSubmitted', filesSubmitted);
        uploader = null;
      });

      provide('uploader', reactive(uploader));
      return {
        uploader,
        started,
        files,
        fileList,
        uploadStart,
        fileAdded,
        filesAdded,
        fileRemoved,
        filesSubmitted,
        allEvent,
        uploaderList,
      };
    },
  };
</script>

<style>
  .uploader {
    position: relative;
  }
</style>
