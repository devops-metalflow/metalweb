<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="500px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template v-if="isUpdate" #menu="{ model, field }">
        <BasicTree
          v-model:value="model[field]"
          :treeData="treeData"
          :checked-keys="checkedMenuKeys"
          :replaceFields="{ key: 'id' }"
          checkable
          toolbar
          title="菜单分配"
        />
      </template>
      <template v-if="isUpdate" #api="{ model, field }">
        <BasicTree
          v-model:value="model[field]"
          :treeData="apiTreeData"
          :checked-keys="checkedApiKeys"
          :replaceFields="{ key: 'id' }"
          checkable
          toolbar
          title="接口分配"
        />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>

<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './role.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { createRole, updateRole, updateRoleApis, updateRoleMenus } from '/@/api/sys/role';
  import { BasicTree, TreeItem } from '/@/components/Tree';
  import { getAllMenuByRoleId } from '/@/api/sys/menu';
  import { getAllApiGroupByCategoryByRoleId } from '/@/api/sys/apis';

  export default defineComponent({
    name: 'RoleDrawer',
    components: { BasicDrawer, BasicForm, BasicTree },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref(0);
      const treeData = ref<TreeItem[]>([]);
      const checkedMenuKeys = ref<string[]>([]);
      const apiTreeData = ref<TreeItem[]>([]);
      const checkedApiKeys = ref<string[]>([]);

      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 90,
        schemas: formSchema,
        showActionButtonGroup: false,
      });
      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        await resetFields();
        setDrawerProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;

        if (unref(isUpdate)) {
          // 填充菜单树的数据
          rowId.value = data.record.id;
          const { list, accessIds } = await getAllMenuByRoleId(rowId.value);
          // console.log('data: ', list);
          treeData.value = list as any as TreeItem[];
          checkedMenuKeys.value = accessIds as any as string[];

          // 填充api接口树的数据
          const { list: apiList, accessIds: apiAccessIds } = await getAllApiGroupByCategoryByRoleId(
            rowId.value
          );
          apiTreeData.value = apiList as any as TreeItem[];
          checkedApiKeys.value = apiAccessIds as any as string[];
          await setFieldsValue({
            ...data.record,
          });
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增角色' : '编辑角色'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });
          if (isUpdate.value) {
            // 更新角色的菜单
            const newMenus = values.menu as any as string[];
            // 先求出交集
            const commonValues = newMenus.filter((v) => {
              return checkedMenuKeys.value.indexOf(v) > -1;
            });
            // 求出新增的id
            const createIds = newMenus.filter((v) => {
              return commonValues.indexOf(v) == -1;
            });
            const deleteIds = checkedMenuKeys.value.filter((v) => {
              return commonValues.indexOf(v) == -1;
            });
            // console.log('delete: ', deleteIds, 'create: ', createIds);
            if (createIds.length != 0 || deleteIds.length != 0) {
              await updateRoleMenus(rowId.value, {
                create: createIds,
                delete: deleteIds,
              });
            }

            // 更新角色的api
            const newApis = (values.api as any as string[]).filter((v) => {
              // 排除掉父节点的id
              return v.toString().indexOf('-') == -1;
            });
            const commonApiValues = newApis.filter((v) => {
              return checkedApiKeys.value.indexOf(v) > -1;
            });
            const createApiIds = newApis.filter((v) => {
              return commonApiValues.indexOf(v) == -1;
            });
            const deleteApiIds = checkedApiKeys.value.filter((v) => {
              return commonApiValues.indexOf(v) == -1;
            });
            // console.log('delete: ', deleteApiIds, 'create: ', createApiIds);
            if (createApiIds.length != 0 || deleteApiIds.length != 0) {
              await updateRoleApis(rowId.value, {
                create: createApiIds,
                delete: deleteApiIds,
              });
            }
            await updateRole(rowId.value, values);
          } else {
            await createRole(values);
          }
          closeDrawer();
          emit('success', { isUpdate: unref(isUpdate) });
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return {
        isUpdate,
        registerDrawer,
        registerForm,
        getTitle,
        treeData,
        checkedMenuKeys,
        apiTreeData,
        checkedApiKeys,
        handleSubmit,
      };
    },
  });
</script>

<style scoped></style>
