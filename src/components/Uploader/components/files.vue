<template>
  <div class="uploader-files">
    <slot :files="files">
      <ul>
        <li v-for="file in files" :key="file.id">
          <uploader-file :file="file" />
        </li>
      </ul>
    </slot>
  </div>
</template>

<script>
  import { inject, ref, watch } from 'vue';
  import UploaderFile from './file.vue';

  const COMPONENT_NAME = 'uploader-files';

  export default {
    name: COMPONENT_NAME,
    components: {
      UploaderFile,
    },
    setup() {
      const uploader = inject('uploader');
      const files = ref([]);
      watch(uploader.files, () => {
        files.value = uploader.files;
      });
      return {
        files,
      };
    },
  };
</script>

<style>
  .uploader-files {
    position: relative;
  }
  .uploader-files > ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
</style>
