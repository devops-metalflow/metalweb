<template>
  <Card
    :tab-list="tabListTitle"
    v-bind="$attrs"
    :active-tab-key="activeKey"
    @tabChange="onTabChange"
  >
    <p v-if="activeKey === 'tab1'">
      <RegionNodeBar />
    </p>
    <p v-if="activeKey === 'tab2'">
      <ManagerNodeBar />
    </p>
  </Card>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';

  import { Card } from 'ant-design-vue';

  import RegionNodeBar from './RegionNodeBar.vue';
  import ManagerNodeBar from './ManagerNodeBar.vue';

  export default defineComponent({
    components: { RegionNodeBar, Card, ManagerNodeBar },
    setup() {
      const activeKey = ref('tab1');

      const tabListTitle = [
        {
          key: 'tab1',
          tab: '机器地域',
        },
        {
          key: 'tab2',
          tab: '机器责任人',
        },
      ];

      function onTabChange(key) {
        activeKey.value = key;
      }
      return { tabListTitle, activeKey, onTabChange };
    },
  });
</script>
