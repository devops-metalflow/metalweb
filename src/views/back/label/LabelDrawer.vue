<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="应用标签到机器"
    width="50%"
    @ok="handleSubmit"
  >
    <Divider>以下标签</Divider>
    <div>
      <Tag color="cyan" v-for="(item, index) in listLabels" :key="index">
        {{ item }}
      </Tag>
    </div>
    <Divider>应用到如下机器</Divider>
    <BasicForm @register="registerForm">
      <template #customSlot="{ model, field }">
        <Select
          v-model:value="model[field]"
          mode="multiple"
          style="width: 100%"
          :options="nodeOptions"
          placeholder="请选择机器ip地址"
        />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>

<script lang="ts">
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { defineComponent, ref } from 'vue';
  import { Tag, Divider, Select } from 'ant-design-vue';
  import { labelFormSchema } from '/@/views/back/label/label.data';
  import { getNodeList, updateNode } from '/@/api/node/node';

  export default defineComponent({
    name: 'LabelDrawer',
    components: { BasicDrawer, BasicForm, Tag, Divider, Select },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const listLabels = ref([]);
      const listLabelIds = ref<number[]>([]);
      const nodeOptions = ref<any[]>([]);
      const [registerForm, { resetFields, validate }] = useForm({
        labelWidth: 100,
        schemas: labelFormSchema,
        showActionButtonGroup: false,
        baseColProps: { lg: 12, md: 24 },
      });
      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        await resetFields();
        await getAllNodes();
        setDrawerProps({ confirmLoading: false });
        listLabels.value = data.names;
        listLabelIds.value = data.ids;
      });

      async function handleSubmit() {
        const values = await validate();
        const { nodes } = values;
        for (const node of nodes) {
          const nodeId = nodeOptions.value.find((item) => item.value == node).key;
          await updateNode(nodeId, { labelIds: listLabelIds.value });
        }
        closeDrawer();
        emit('success');
      }
      async function getAllNodes() {
        const result = await getNodeList({ noPagination: true });
        nodeOptions.value = result.list.map((item) => {
          const { id, address } = item;
          return { key: id, value: address };
        });
      }
      return { registerDrawer, registerForm, handleSubmit, listLabels, nodeOptions };
    },
  });
</script>

<style scoped></style>
