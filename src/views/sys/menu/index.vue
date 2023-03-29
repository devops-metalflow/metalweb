<template>
  <div>
    <BasicTable @register="registerTable" @fetch-success="onFetchSuccess">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增菜单 </a-button>
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
    <MenuDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>

<script>
  import { defineComponent, nextTick } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { searchFormSchema, columns } from './menu.data';
  import { useDrawer } from '/@/components/Drawer';
  import { getMenuList } from '/@/api/sys/menu';
  import { deleteMenu } from '/@/api/sys/menu';
  import MenuDrawer from './MenuDrawer.vue';
  import { useIdempotenceStore } from '/@/store/modules/idempotence';

  export default defineComponent({
    name: 'Menu',
    components: { BasicTable, MenuDrawer, TableAction },
    setup() {
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerTable, { reload, expandAll }] = useTable({
        title: '菜单列表',
        api: getMenuList,
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        isTreeTable: true,
        pagination: false,
        striped: false,
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        showIndexColumn: false,
        canResize: false,
        showSummary: true,
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
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
        await deleteMenu({
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

      function onFetchSuccess() {
        // 演示默认展开所有表项
        nextTick(expandAll);
      }

      return {
        registerTable,
        registerDrawer,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        onFetchSuccess,
      };
    },
    created() {
      const idempotenceInfo = useIdempotenceStore();
      idempotenceInfo.RefreshIdempotenceToken();
    },
  });
</script>

<style scoped></style>
