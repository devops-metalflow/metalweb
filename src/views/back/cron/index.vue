<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增任务 </a-button>
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
    <CronModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { searchFormSchema, columns } from './cron.data';
  import { useIdempotenceStore } from '/@/store/modules/idempotence';
  import { useModal } from '/@/components/Modal';
  import CronModal from './CronModal.vue';
  import { getCronShutNodeList, deleteCronShutNode } from '/@/api/back/cron';

  export default defineComponent({
    name: 'CronShutNode',
    components: { BasicTable, CronModal, TableAction },
    setup() {
      const [registerModal, { openModal }] = useModal();
      const [registerTable, { reload }] = useTable({
        title: '定时开关机任务',
        rowKey: 'id',
        api: getCronShutNodeList,
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
        await deleteCronShutNode({
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
        registerModal,
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
