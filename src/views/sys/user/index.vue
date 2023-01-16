<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <BasicTable @register="registerTable">
      <!--      <template #toolbar>-->
      <!--        <a-button type="primary" @click="handleCreate">新增用户</a-button>-->
      <!--      </template>-->
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: '编辑',
              icon: 'clarity:note-edit-line',
              onClick: handleEdit.bind(null, record),
              color: 'success',
            },
            {
              label: '删除',
              icon: 'ic:outline-delete-outline',
              popConfirm: {
                title: '是否确认删除,该操作不可逆',
                confirm: handleDelete.bind(null, record),
              },
              color: 'error',
            },
          ]"
        />
      </template>
    </BasicTable>
    <UserModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import BasicTable from '/@/components/Table/src/BasicTable.vue';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { PageWrapper } from '/@/components/Page';
  import { useTable } from '/@/components/Table';
  import { deleteUser, getUserList } from '/@/api/sys/user';

  import { useModal } from '/@/components/Modal';
  import UserModal from './UserModal.vue';

  import { columns, searchFormSchema } from '/@/views/sys/user/user.data';
  import { useIdempotenceStore } from '/@/store/modules/idempotence';
  export default defineComponent({
    name: 'User',
    components: { TableAction, BasicTable, PageWrapper, UserModal },
    setup: function () {
      const [registerModal, { openModal }] = useModal();
      const [registerTable, { reload }] = useTable({
        title: '用户管理列表',
        titleHelpMessage: '根据操作对列表进行管理',
        rowKey: 'id',
        api: getUserList,
        columns,
        useSearchForm: true,
        formConfig: {
          labelWidth: 50,
          schemas: searchFormSchema,
          autoSubmitOnEnter: true,
        },
        showTableSetting: true,
        bordered: true,
        handleSearchInfoFn(info) {
          console.log('searchINfo', info);
          return info;
        },
        actionColumn: {
          width: 250,
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

      function handleEdit(record: Recordable) {
        openModal(true, {
          record,
          isUpdate: true,
        });
      }

      async function handleDelete(record: Recordable) {
        await deleteUser({
          ids: `${record.id}`,
        }).then(() => {
          reload();
        });
        // console.log('点击了删除', record);
      }

      function handleSuccess() {
        reload();
      }

      return {
        registerTable,
        registerModal,
        handleEdit,
        handleDelete,
        handleSuccess,
        handleCreate,
      };
    },
    created() {
      const idempotenceInfo = useIdempotenceStore();
      idempotenceInfo.RefreshIdempotenceToken();
    },
  });
</script>

<style scoped></style>
