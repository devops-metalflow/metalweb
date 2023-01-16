<template>
  <div ref="chartRef" :style="{ height, width }"></div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref, Ref } from 'vue';

  import { useECharts } from '/@/hooks/web/useECharts';

  import { basicProps } from './props';
  import { managerNodeData } from '/@/api/dashboard/dashboard';
  export default defineComponent({
    name: 'ManagerNodeBar',
    props: basicProps,
    setup() {
      const chartRef = ref<HTMLDivElement | null>(null);
      const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

      onMounted(async () => {
        const managerData = await managerNodeData();
        const xData: string[] = managerData.map((item) => {
          return item.manager ? item.manager : '未确定';
        });
        const yData: number[] = managerData.map((item) => {
          return item.count;
        });
        setOptions({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              lineStyle: {
                width: 1,
                color: '#019680',
              },
            },
          },
          grid: { left: '1%', right: '1%', top: '2  %', bottom: 0, containLabel: true },
          xAxis: {
            type: 'category',
            data: xData,
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              data: yData,
              type: 'bar',
              barMaxWidth: 80,
              label: {
                show: true,
                position: 'top',
              },
            },
          ],
        });
      });
      return { chartRef };
    },
  });
</script>
