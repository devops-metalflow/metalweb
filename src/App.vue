<template>
  <ConfigProvider :locale="getAntdLocale">
    <AppProvider>
      <RouterView />
    </AppProvider>
  </ConfigProvider>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { ConfigProvider } from 'ant-design-vue';
  import { AppProvider } from '/@/components/Application';
  import { useTitle } from '/@/hooks/web/useTitle';
  import { useLocale } from '/@/locales/useLocale';

  import intro from 'intro.js';
  import 'intro.js/minified/introjs.min.css';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStoreWithOut } from '/@/store/modules/user';

  export default defineComponent({
    name: 'App',
    components: { ConfigProvider, AppProvider },
    setup() {
      useTitle();

      // support Multi-language
      const { getAntdLocale } = useLocale();

      return { getAntdLocale };
    },
    mounted() {
      const userStore = useUserStoreWithOut();
      const token = userStore.getToken;

      if (!localStorage.getItem('t_show_guide') && token) {
        const { notification } = useMessage();
        intro()
          .setOptions({
            nextLabel: '下一个', // 下一个按钮文字
            prevLabel: '上一个', // 上一个按钮文字
            skipLabel: '跳过', // 跳过按钮文字
            doneLabel: '立即体验', // 完成按钮文字
            hidePrev: true, // 在第一步中是否隐藏上一个按钮
            steps: [
              {
                title: '欢迎',
                element: '.vben-app-logo',
                intro: '欢迎使用metalflow服务器管理系统！',
              },
              {
                title: '折叠按钮',
                element: '.vben-layout-header-trigger',
                intro: '这是用来折叠左边菜单的按钮.点击左边菜单栏可浏览自己感兴趣的页面',
              },
              {
                title: '用户操作',
                element: '.vben-layout-header-action',
                intro: '这是用户操作区域.可设置系统主题等',
              },
              {
                title: '页面设置',
                element: '.ant-tabs-extra-content',
                intro: '这里可以对当前显示的页面进行配置',
              },
            ],
          })
          .onexit(() => {
            notification.success({
              message: '完成',
              description: '下面开始使用吧！',
              duration: 4,
            });
            localStorage.setItem('t_show_guide', 'true');
          })
          .start();
      }
    },
  });
</script>
