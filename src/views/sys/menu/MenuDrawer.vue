<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './menu.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  import { createMenu, getMenuList, updateMenu } from '/@/api/sys/menu';

  export default defineComponent({
    name: 'MenuDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const rowId = ref(0);

      const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
        labelWidth: 100,
        schemas: formSchema,
        showActionButtonGroup: false,
        baseColProps: { lg: 12, md: 24 },
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        await resetFields();
        setDrawerProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;

        if (unref(isUpdate)) {
          rowId.value = data.record.id;
          await setFieldsValue({
            ...data.record,
          });
        }
        const treeData = await refreshMenuTreeOptions();
        console.log('treeData: ', treeData);
        await updateSchema({
          field: 'parentId',
          componentProps: { treeData },
        });
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增菜单' : '编辑菜单'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });
          if (isUpdate.value) {
            await updateMenu(rowId.value, values);
          } else {
            await createMenu(values);
          }
          closeDrawer();
          emit('success', { isUpdate: unref(isUpdate) });
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      async function refreshMenuTreeOptions() {
        let menuTreeOptions: any[] = [];
        // 包裹根菜单
        const treeData = await getMenuList({});
        const menu = { id: '0', title: '顶级目录', children: getMenuOptions(treeData) };
        menuTreeOptions.push(menu);
        return menuTreeOptions;
      }

      function getMenuOptions(data: any) {
        const menus: any[] = [];
        for (let i = 0, len = data.length; i < len; i++) {
          const item = data[i];
          let title = item.title;
          let menu: any = {
            // 必须是string, 否则会导致不能设置默认值
            id: String(item.id),
            title,
          };
          if (item.children.length > 0) {
            menu = {
              ...menu,
              children: getMenuOptions(item.children),
            };
          }
          menus.push(menu);
        }
        return menus;
      }

      return { registerDrawer, registerForm, getTitle, handleSubmit };
    },
  });
</script>
