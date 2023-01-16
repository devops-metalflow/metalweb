<template>
  <Card title="机器健康情况" :loading="loading">
    <div ref="chartRef" :style="{ width, height }"></div>
  </Card>
</template>
<script lang="ts">
  import { defineComponent, Ref, ref, watch } from 'vue';

  import { Card } from 'ant-design-vue';
  import { useECharts } from '/@/hooks/web/useECharts';
  import { healthNodeData } from '/@/api/dashboard/dashboard';

  export default defineComponent({
    name: 'HealthNodePie',
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
          const healthData = await healthNodeData();
          const data = healthData.map((item) => {
            const healthStr = ['运行中', '异常', '已停机'];
            return {
              name: healthStr[item.health],
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
                name: '机器健康情况',
                type: 'pie',
                radius: '80%',
                center: ['50%', '50%'],
                color: ['#5ab1ef', '#a02b47', '#8c9595'],
                data: data,
                label: {
                  show: true,
                  position: 'outside',
                  formatter: '{b}: {c}({d}%)',
                },
                labelLine: {
                  show: true,
                  lineStyle: { color: '#3c4858' },
                },
                roseType: 'radius',
                animationType: 'scale',
                animationEasing: 'exponentialInOut',
                animationDelay: function () {
                  return Math.random() * 400;
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
