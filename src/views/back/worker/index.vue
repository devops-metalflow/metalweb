<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增worker </a-button>
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
                title: '是否确认删除,该操作不可逆',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <WorkerDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { columns, searchFormSchema } from './worker.data';

  import { useDrawer } from '/@/components/Drawer';
  import WorkerDrawer from '/@/views/back/worker/workerDrawer.vue';
  import { useIdempotenceStore } from '/@/store/modules/idempotence';
  import { deleteWorker, getWorkerList } from '/@/api/back/worker';

  export default defineComponent({
    name: 'Workers',
    components: { WorkerDrawer, BasicTable, TableAction },
    setup() {
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerTable, { reload }] = useTable({
        title: 'worker列表',
        columns,
        rowKey: 'id',
        formConfig: {
          labelWidth: 80,
          schemas: searchFormSchema,
        },
        useSearchForm: true,
        api: getWorkerList,
        showTableSetting: true,
        bordered: true,
        showIndexColumn: true,
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: undefined,
        },
      });

      function handleCreate() {
        openDrawer(true, {
          isUpdate: false,
        });
      }

      function handleEdit(record: Recordable) {
        openDrawer(true, {
          record,
          isUpdate: true,
        });
      }

      async function handleDelete(record: Recordable) {
        await deleteWorker({
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

      return {
        registerTable,
        registerDrawer,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
      };
    },
    created() {
      const idempotenceInfo = useIdempotenceStore();
      idempotenceInfo.RefreshIdempotenceToken();
    },
  });
</script>

<style scoped></style>
