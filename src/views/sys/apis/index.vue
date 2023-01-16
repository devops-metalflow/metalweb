<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增接口 </a-button>
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
    <ApiDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useDrawer } from '/@/components/Drawer';
  import { columns, searchFormSchema } from './api.data';
  import { getApiList, deleteApi } from '/@/api/sys/apis';
  import ApiDrawer from './ApiDrawer.vue';
  import { useIdempotenceStore } from '/@/store/modules/idempotence';

  export default defineComponent({
    name: 'Apis',
    components: { BasicTable, TableAction, ApiDrawer },
    setup() {
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerTable, { reload }] = useTable({
        title: '接口列表',
        columns,
        rowKey: 'id',
        formConfig: {
          labelWidth: 80,
          schemas: searchFormSchema,
        },
        useSearchForm: true,
        api: getApiList,
        showTableSetting: true,
        bordered: true,
        showIndexColumn: false,
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

      function handleEdit(record) {
        openDrawer(true, {
          record,
          isUpdate: true,
        });
      }

      async function handleDelete(record) {
        await deleteApi({
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
        reload,
        handleEdit,
        handleCreate,
        handleDelete,
        registerDrawer,
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
