<template>
  <Card title="机器性能" :loading="loading">
    <div ref="chartRef" :style="{ width, height }"></div>
  </Card>
</template>
<script lang="ts">
  import { defineComponent, Ref, ref, watch } from 'vue';

  import { Card } from 'ant-design-vue';
  import { useECharts } from '/@/hooks/web/useECharts';
  import { performanceNodeData } from '/@/api/dashboard/dashboard';

  export default defineComponent({
    name: 'PerformNodePie',
    components: { Card },
    props: {
      loading: Boolean,
      width: {
        type: String as PropType<string>,
        default: '100%',
      },
      height: {
        type: String as PropType<string>,
        default: '300px',
      },
    },
    setup(props) {
      const chartRef = ref<HTMLDivElement | null>(null);
      const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);
      watch(
        () => props.loading,
        async () => {
          const performanceData = await performanceNodeData();
          const data = performanceData.map((item) => {
            const performStr = ['高性能', '中性能', '低性能'];
            return {
              name: performStr[item.performance],
              value: item.count,
            };
          });
          if (props.loading) {
            return;
          }
          setOptions({
            tooltip: {
              trigger: 'item',
            },
            legend: {
              top: '1%',
              left: '1%',
            },
            series: [
              {
                color: ['#5ab1ef', '#b6a2de', '#742dc3'],
                name: '机器性能',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                  borderRadius: 10,
                  borderColor: '#fff',
                  borderWidth: 2,
                },
                label: {
                  show: true,
                  position: 'outer',
                  formatter: '{b}: {c}({d}%)',
                },
                labelLine: {
                  show: true,
                  lineStyle: { color: '#3c4858' },
                },
                emphasis: {
                  label: {
                    show: true,
                    fontSize: '12',
                    fontWeight: 'bold',
                  },
                },
                labelLine: {
                  show: false,
                },
                data: data,
                animationType: 'scale',
                animationEasing: 'exponentialInOut',
                animationDelay: function () {
                  return Math.random() * 100;
                },
              },
            ],
          });
        },
        { immediate: true }
      );
      return { chartRef };
    },
  });
</script>
