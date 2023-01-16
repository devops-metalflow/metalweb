<template>
  <div ref="chartRef" :style="{ height, width }"></div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref, Ref } from 'vue';

  import { useECharts } from '/@/hooks/web/useECharts';

  import { basicProps } from './props';
  import { regionNodeData } from '/@/api/dashboard/dashboard';
  import { RegionNodeItemModel } from '/@/api/dashboard/mode/dashboardModel';
  export default defineComponent({
    name: 'RegionNodeBar',
    props: basicProps,
    setup() {
      const chartRef = ref<HTMLDivElement | null>(null);
      const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

      onMounted(async () => {
        const regionData: RegionNodeItemModel[] = await regionNodeData();
        const regionZh = {
          Chengdu: '成都',
          "Xi'an": '西安',
          Shanghai: '上海',
          Other: '其他',
        };
        const xData: string[] = regionData.map((item) => {
          return item.region ? regionZh[item.region] : '未确定';
        });
        const yData: number[] = regionData.map((item) => {
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
          xAxis: {
            type: 'category',
            data: xData,
          },
          yAxis: [
            {
              type: 'value',
            },
          ],
          grid: { left: '1%', right: '1%', top: '2  %', bottom: 0, containLabel: true },
          series: [
            {
              data: yData,
              type: 'bar',
              barMaxWidth: 80,
              label: {
                show: true,
                position: 'top',
              },
              itemStyle: {
                color: '#1cb881',
              },
            },
          ],
        });
      });
      return { chartRef };
    },
  });
</script>
