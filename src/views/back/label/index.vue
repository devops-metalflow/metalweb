<template>
  <div>
    <BasicTable
      :rowSelection="{ type: 'checkbox', selectedRowKeys: selectedKeys, onChange: onSelectChange }"
      @register="registerTable"
    >
      <template #toolbar>
        <a-button type="primary" :disabled="!hasSelected" @click="handleSelect"> 应用 </a-button>
        <a-button type="primary" @click="handleCreate"> 新增标签 </a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <LabelModal @register="registerModal" @success="handleSuccess" />
    <LabelDrawer @register="registerDrawer" @success="handleSetSuccess" />
  </div>
</template>

<script>
  import { computed, defineComponent, ref, unref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { searchFormSchema, columns } from './label.data';
  import { useIdempotenceStore } from '/@/store/modules/idempotence';
  import { getLabelList, deleteLabel } from '/@/api/back/label';
  import { useModal } from '/@/components/Modal';
  import LabelModal from './LabelModal.vue';
  import { useDrawer } from '/@/components/Drawer';
  import LabelDrawer from './LabelDrawer.vue';
  import { notification } from 'ant-design-vue';

  export default defineComponent({
    name: 'Label',
    components: { BasicTable, LabelModal, LabelDrawer, TableAction },
    setup() {
      const selectedKeys = ref([]);
      const hasSelected = computed(() => unref(selectedKeys).length > 0);

      const [registerModal, { openModal }] = useModal();
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerTable, { reload, getSelectRowKeys, getSelectRows }] = useTable({
        title: '标签列表',
        rowKey: 'id',
        api: getLabelList,
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        clickToRowSelect: false,
        striped: false,
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        showIndexColumn: true,
        canResize: false,
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
        },
      });

      function onSelectChange() {
        selectedKeys.value = getSelectRowKeys();
      }

      function handleSelect() {
        const names = getSelectRows().map((data) => {
          return data['name'];
        });
        openDrawer(true, {
          ids: getSelectRowKeys(),
          names,
        });
      }

      function handleCreate() {
        openModal(true, {
          isUpdate: false,
        });
      }

      function handleEdit(record) {
        openModal(true, {
          record,
          isUpdate: true,
        });
      }

      async function handleDelete(record) {
        await deleteLabel({
          ids: `${record.id}`,
        }).then(() => {
          reload();
        });
      }

      function handleSuccess({ isUpdate }) {
        reload();
        if (!isUpdate) {
          const idempotenceInfo = useIdempotenceStore();
          idempotenceInfo.RefreshIdempotenceToken();
        }
      }

      function handleSetSuccess() {
        selectedKeys.value = [];
        notification.success({
          message: '完成',
          description: '应用成功！',
          duration: 3,
        });
      }

      return {
        onSelectChange,
        handleSelect,
        selectedKeys,
        hasSelected,
        registerDrawer,
        registerTable,
        registerModal,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        handleSetSuccess,
      };
    },
    created() {
      const idempotenceInfo = useIdempotenceStore();
      idempotenceInfo.RefreshIdempotenceToken();
    },
  });
</script>

<style scoped></style>
