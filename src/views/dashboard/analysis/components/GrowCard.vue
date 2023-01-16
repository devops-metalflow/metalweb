<template>
  <div class="md:flex">
    <template v-for="(item, index) in growCardList" :key="item.title">
      <Card
        size="small"
        :loading="$attrs.loading"
        :title="item.title"
        class="md:w-1/4 w-full md:!mt-0 !mt-4"
        :class="[index + 1 < 4 && 'md:!mr-4']"
        :canExpan="false"
      >
        <div class="py-4 px-4 flex justify-between">
          <CountTo :startVal="1" :endVal="item.value" class="text-2xl" />
          <Icon :icon="item.icon" :size="40" />
        </div>
      </Card>
    </template>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';

  import { CountTo } from '/@/components/CountTo';
  import { Icon } from '/@/components/Icon';
  import { Card } from 'ant-design-vue';

  import { GrowCardItem } from '../data';
  import { countData } from '/@/api/dashboard/dashboard';
  export default defineComponent({
    components: { CountTo, Card, Icon },
    setup() {
      const growCardList = ref<GrowCardItem[]>([]);
      async function getGrowData() {
        const growData = await countData();
        growCardList.value = [
          {
            title: '机器总数',
            icon: 'servers|svg',
            value: growData.nodeCount,
          },
          {
            title: '运行中机器',
            icon: 'health-server|svg',
            value: growData.normalNodeCount,
          },
          {
            title: '高性能机器',
            icon: 'high-server|svg',
            value: growData.highPerformanceNodeCount,
          },
          {
            title: '用户数',
            icon: 'users|svg',
            value: growData.userCount,
          },
        ];
      }
      onMounted(() => {
        getGrowData();
      });
      return { growCardList };
    },
  });
</script>
