<template>
  <PageWrapper title="关于">
    <template #headerContent>
      <div class="flex justify-between items-center">
        <span class="flex-1">
          <a :href="SITE_URL" target="_blank">{{ name }}</a>
          是一款基于服务发现的服务器管理系统，
          目标是为中大型项目开发,用于对裸金属，虚拟机，容器，边缘云，私有云，公有云，混合云等Linux机器进行管理。
        </span>
      </div>
    </template>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { PageWrapper } from '/@/components/Page';

  import { SITE_URL } from '/@/settings/siteSetting';
  export default defineComponent({
    name: 'AboutPage',
    components: { PageWrapper },
    setup() {
      const { pkg } = __APP_INFO__;

      const { name } = pkg;

      return { name, SITE_URL };
    },
  });
</script>
