<template>
  <div v-if="nodes.length > 0" style="background-color: #ececec; padding: 20px">
    <Row :gutter="[16, 32]">
      <Col
        class="gutter-row"
        :span="6"
        :xxl="6"
        :xl="8"
        :lg="8"
        :md="8"
        :sm="12"
        v-for="(node, i) in nodes"
        :key="i"
      >
        <Card bordered hoverable style="width: 300px">
          <template #actions>
            <Tooltip placement="bottom">
              <template #title>
                <span>取消收藏</span>
              </template>
              <Icon icon="like-server|svg" size="20" @click="removeMyCollect(node.id)" />
            </Tooltip>
            <Tooltip placement="bottom">
              <template #title>
                <span>添加描述</span>
              </template>
              <Icon
                icon="edit|svg"
                size="20"
                @click="handleEdit(node.collectionId, node.address, node.description)"
              />
            </Tooltip>
            <Tooltip placement="bottom">
              <template #title>
                <span>ssh连接</span>
              </template>
              <Icon icon="terminal-server|svg" size="20" @click="handleTerminal(node.address)" />
            </Tooltip>
          </template>
          <CardMeta :title="node.address" :description="node.description">
            <template #avatar>
              <Popover placement="bottomRight">
                <template #content>
                  <div
                    v-for="(metric, index) in node.metrics"
                    :key="index"
                    style="width: 200px; font-size: 13px; margin-bottom: 25px"
                  >
                    <div>
                      <Icon :icon="metric.icon" :size="15" /><span> {{ metric.name }}</span>
                      <span style="float: right">{{ metric.percent }}</span>
                    </div>
                    <div style="background-color: #d2cbcb; border-radius: 100px; height: 6px">
                      <div
                        :style="{
                          width: metric.percent,
                          'border-radius': 100 + 'px',
                          height: 6 + 'px',
                          'background-color': metric.color,
                        }"
                      ></div>
                    </div>
                    <div
                      ><span style="float: right">{{ metric.used }}/{{ metric.sum }}</span></div
                    >
                  </div>
                </template>
                <Icon :icon="node.performIcon" :size="60" />
              </Popover>
            </template>
          </CardMeta>
        </Card>
      </Col>
    </Row>
    <EditModal @register="registerEditModal" @success="handleEditSuccess" />
  </div>
  <Empty v-else :image-style="{ height: '300px' }" description="你暂无收藏~" />
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { Card, Col, Row, Empty, Tooltip, Popover } from 'ant-design-vue';
  import CardMeta from 'ant-design-vue/lib/card/Meta';

  import { Icon } from '/@/components/Icon';
  import { getMyCollect, removeCollect } from '/@/api/collect/collect';
  import { useRouter } from 'vue-router';
  import { useModal } from '/@/components/Modal';
  import EditModal from '/@/views/node/my/components/EditModal.vue';

  export default defineComponent({
    name: 'MyNode',
    components: { EditModal, Card, Col, Row, Icon, CardMeta, Empty, Tooltip, Popover },
    setup() {
      const router = useRouter();
      const nodes = ref<
        {
          id: number;
          collectionId: number;
          description: string;
          address: string;
          manager?: string;
          metrics: {
            name: string;
            icon: string;
            sum: string;
            used: string;
            percent: string;
            color: string;
          }[];
          asset: string;
          health: string;
          performance: number;
          performIcon: string;
          region: string;
        }[]
      >([]);

      const [registerEditModal, { openModal: openEditModal }] = useModal();

      function handleEdit(collectionId: number, address: string, description: string) {
        openEditModal(true, {
          collectionId,
          address,
          description,
        });
      }

      function handleEditSuccess() {
        getMyCollections();
      }

      function getMyCollections() {
        nodes.value = [];
        getMyCollect()
          .then((nodeInfos) => {
            nodeInfos.forEach((info) => {
              let metricInfos: {
                name: string;
                icon: string;
                sum: string;
                used: string;
                percent: string;
                color: string;
              }[] = [];
              if (info.metrics != '') {
                const metricList = info.metrics.split(',');
                const names = ['cpu', '硬盘', '内存'];
                const icons = ['cpu|svg', 'disk|svg', 'memory|svg'];
                const colors = ['#f5af19', '#087a66', '#9254de'];
                metricList.forEach((v, i) => {
                  const sumUse = v.split('(');
                  if (sumUse.length < 0) {
                    return false;
                  }
                  let sumTemp = sumUse[0].match(/\d+/g);
                  let useTemp = sumUse[1].match(/\d+/g);
                  if (!sumTemp || !useTemp) {
                    return false;
                  }
                  let percent = 0;
                  let sum = '';
                  let used = '';
                  if (i == 0) {
                    percent = parseInt(useTemp[0]);
                    sum = `${parseInt(sumTemp[0])}CPU`;
                    used = `${parseInt(useTemp[0])}%`;
                  } else {
                    if (parseInt(sumTemp[0]) != 0) {
                      percent = (100 * parseInt(useTemp[0])) / parseInt(sumTemp[0]);
                    }
                    sum = `${parseInt(sumTemp[0])} GB`;
                    used = `${parseInt(useTemp[0])} GB`;
                  }
                  metricInfos.push({
                    name: names[i],
                    icon: icons[i],
                    sum: sum,
                    used: used,
                    color: colors[i],
                    percent: `${parseInt(percent)}%`,
                  });
                });
              }

              const performIcon = 'server-vscode|svg';
              const healths = ['运行中', '异常', '已停机'];
              nodes.value.push({
                id: info.id,
                collectionId: info.collectionId,
                description: info.description,
                address: info.address,
                manager: info.manager,
                metrics: metricInfos,
                asset: info.asset,
                health: healths[info.health],
                performance: info.performance,
                performIcon: performIcon,
                region: info.region,
              });
            });
          })
          .catch(() => {});
      }

      function removeMyCollect(nodeId: number) {
        removeCollect({ nodeId: nodeId })
          .then(() => {
            nodes.value = nodes.value.filter((node) => node.id !== nodeId);
          })
          .catch(() => {});
      }

      const openInNewWindowWithParams = (routeName: string, address: string) => {
        const routeData = router.resolve({ path: routeName });
        sessionStorage.setItem('address', address);
        window.open(`${routeData.href}`, '_blank');
      };

      function handleTerminal(address: string) {
        // router.push({
        //   path: '/node/ssh',
        //   query: { address: address },
        // });
        openInNewWindowWithParams('/node/ssh', address);
        // const windowFeatures = 'width=800,height=600,scrollbars=yes,resizable=yes';
        // window.open('/node/ssh?address=' + address, '_blank', windowFeatures);
        // console.log('address: ', address);
      }

      onMounted(() => {
        getMyCollections();
      });

      return {
        nodes,
        removeMyCollect,
        handleTerminal,
        registerEditModal,
        handleEdit,
        handleEditSuccess,
      };
    },
  });
</script>
