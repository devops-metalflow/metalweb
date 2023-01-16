<template>
  <PageWrapper contentClass="flex">
    <BasicTable
      :rowSelection="{ type: 'checkbox', selectedRowKeys: selectedKeys, onChange: onSelectChange }"
      @register="registerTable"
    >
      <template #toolbar>
        <a-button
          type="primary"
          :size="size"
          :disabled="selectedKeys.length === 0"
          @click="handleSelect"
        >
          运行
        </a-button>
        <a-button
          type="error"
          :size="size"
          :disabled="selectedKeys.length === 0"
          @click="handleReboot"
        >
          重启
        </a-button>
        <a-button type="primary" :size="size" @click="handleAdd">新增</a-button>
        <a-button type="default" :size="size" @click="exportNodes">
          <DownloadOutlined />
          导出
        </a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: '详情',
              icon: 'mdi:text-long',
              onClick: handleInfo.bind(null, record),
            },
            {
              label: '控制台',
              icon: 'fe:terminal',
              onClick: handleTerminal.bind(null, record),
              color: 'success',
            },
            {
              label: '收藏',
              icon: 'add-like|svg',
              onClick: handleCollect.bind(null, record),
            },
          ]"
          :dropDownActions="[
            {
              label: ' 刷新',
              icon: 'mdi:database-refresh-outline',
              popConfirm: {
                title: '5分钟内不允许重复刷新？',
                confirm: handleRefresh.bind(null, record),
              },
              color: 'success',
            },
            {
              label: '运行',
              icon: 'mdi:script-text-play-outline',
              onClick: handleUpload.bind(null, record),
              color: 'success',
            },
            {
              label: ' 删除',
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

      <!-- 添加自定义列 -->
      <template #labelTitle>
        <span>
          标签
          <FormOutlined />
        </span>
      </template>
      <template #labels="{ record }">
        <div :class="prefixCls">
          <div v-if="!editableData[record.id]" :class="`${prefixCls}__normal`">
            <template v-if="record.labels.length">
              <span>
                <Tag
                  v-for="(item, index) in record.labels"
                  :key="index"
                  :color="
                    index % 7 === 0
                      ? 'volcano'
                      : index % 7 === 1
                      ? 'purple'
                      : index % 7 === 3
                      ? 'geekblue'
                      : index % 7 === 4
                      ? 'blue'
                      : index % 7 === 5
                      ? 'cyan'
                      : index % 7 === 6
                      ? 'green'
                      : 'magenta'
                  "
                >
                  {{ item.name }}
                </Tag>
              </span>
            </template>
            <template v-else>
              <span>&nbsp;</span>
            </template>
            <FormOutlined :class="`${prefixCls}__normal-icon`" @click="edit(record.id)" />
          </div>
          <div v-else :class="`${prefixCls}__wrapper`">
            <CellComponent
              v-bind="getComponentProps"
              :component="'ApiSelect'"
              :style="getWrapperStyle"
              :class="getWrapperClass"
              size="small"
              ref="elRef"
            />
            <div :class="`${prefixCls}__action`">
              <CheckOutlined
                :class="[`${prefixCls}__icon`, 'mx-2']"
                @click="editSubmit(record.id)"
              />
              <CloseOutlined :class="`${prefixCls}__icon `" @click="editCancel(record.id)" />
            </div>
          </div>
        </div>
      </template>
    </BasicTable>
    <ConfirmModal @register="registerConfirmModal" @success="handleConnect" />
    <UploaderModal @register="registerUploaderModal" />

    <!-- Terminal终端模态框 -->
    <BasicModal
      v-bind="$attrs"
      v-model:visible="visible"
      :destroyOnClose="true"
      :title="'SSH > ' + address"
      :useWrapper="true"
      :footer="null"
      width="100%"
      :defaultFullscreen="true"
      @register="registerTerminalModal"
    >
      <PreShell
        v-if="ifTerminal"
        :address="address"
        :ssh-port="sshPort"
        :username="username"
        :password="password"
        @exit="closeTerminalModal"
      />
    </BasicModal>
    <AddModal @register="registerAddModal" @success="handleAddSuccess" />
    <UploaderDrawer @register="registerDrawer" @success="handleRunSuccess" />
  </PageWrapper>
</template>

<script lang="ts">
  import {
    defineComponent,
    createVNode,
    ref,
    computed,
    CSSProperties,
    UnwrapRef,
    reactive,
    h,
  } from 'vue';
  import { useTable } from '/@/components/Table';
  import BasicTable from '/@/components/Table/src/BasicTable.vue';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { CellComponent } from '/@/components/Table/src/components/editable/CellComponent';
  import { PageWrapper } from '/@/components/Page';
  import { jsonToSheetXlsx } from '/@/components/Excel';
  import { useModal, useModalInner } from '/@/components/Modal/src/hooks/useModal';
  import { BasicModal } from '/@/components/Modal';
  import {
    FormOutlined,
    CloseOutlined,
    CheckOutlined,
    DownloadOutlined,
  } from '@ant-design/icons-vue';
  import { Tag, Modal } from 'ant-design-vue';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { cloneDeep, omit } from 'lodash-es';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { getNodeList, updateNode, deleteNode, refreshNode, rebootNode } from '/@/api/node/node';
  import { getLabelList } from '/@/api/back/label';
  import { columns, searchFormSchema } from '/@/views/node/list/list.data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import AddModal from '/@/views/node/list/components/AddModal.vue';
  import UploaderModal from '/@/views/node/list/components/UploaderModal.vue';
  import { useIdempotenceStore } from '/@/store/modules/idempotence';
  import { JsonPreview } from '/@/components/CodeEditor';
  import { useDrawer } from '/@/components/Drawer';
  import UploaderDrawer from './components/UploaderDrawer.vue';
  import { addCollect } from '/@/api/collect/collect';
  import { useRouter } from 'vue-router';

  export default defineComponent({
    name: 'NodeList',
    components: {
      AddModal,
      TableAction,
      BasicTable,
      PageWrapper,
      UploaderModal,
      BasicModal,
      Tag,
      CellComponent,
      FormOutlined,
      CloseOutlined,
      CheckOutlined,
      DownloadOutlined,
      UploaderDrawer,
    },
    setup() {
      // 远程终端对话框属性设置
      const { notification } = useMessage();
      const visible = ref<boolean>(false);
      const ifTerminal = ref<boolean>(false);
      const address = ref<string>('');
      const sshPort = ref<number>(22);
      const username = ref<string>('');
      const password = ref<string>('');

      const selectedKeys = ref<string[]>([]);

      // 可编辑单元格设置
      const { prefixCls } = useDesign('editable-cell');
      const valueRef = ref<any[]>([]);
      const editableData: UnwrapRef<Record<string, Recordable>> = reactive({});
      const router = useRouter();

      const [registerTable, { reload, getDataSource, getSelectRowKeys, getSelectRows }] = useTable({
        title: '服务器列表',
        titleHelpMessage: '根据操作对服务器进行管理',
        // rowSelection: { type: 'checkbox' },
        // clickToRowSelect: false,
        rowKey: 'id',
        clickToRowSelect: false,
        api: getNodeList,
        columns,
        showIndexColumn: true,
        useSearchForm: true,
        formConfig: {
          labelWidth: 80,
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
          width: 260,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
        },
      });

      // 使用terminal的输入用户名与密码的模态框
      const [registerConfirmModal, { openModal: openConfirmModal }] = useModal();
      const [registerTerminalModal, { closeModal: closeTerminalModal }] = useModalInner();

      const [registerDrawer, { openDrawer }] = useDrawer();

      // 使用上传文件模态框
      const [registerUploaderModal, { openModal: openUploaderModal }] = useModal();

      const edit = (key: string) => {
        editableData[key] = cloneDeep(getDataSource().filter((item) => key === item.id)[0]);
        editableData[key].labels.forEach((val: any) => {
          valueRef.value.push({ key: val.id, value: val.id, label: val.name });
        });
        // 清理labels数据，以免重复添加
        editableData[key].labels = [];
      };
      const editSubmit = (key: string) => {
        let labelIds: number[] = [];
        const editObject = getDataSource().filter((item) => key === item.id)[0];
        valueRef.value.forEach((val: any) => {
          editableData[key].labels.push({ id: val.key, name: val.label });
          labelIds.push(val.key);
        });
        // 清理绑定value数据，以免重复添加
        valueRef.value = [];
        Object.assign(editObject, editableData[key]);

        updateNode(key, { labelIds: labelIds })
          .then((_res) => {
            console.log('update labels success.');
          })
          .catch((_res) => {
            console.log('update labels fail.');
          });
        delete editableData[key];
      };
      const editCancel = (key: string) => {
        valueRef.value = [];
        delete editableData[key];
      };
      // ApiSelect 属性设置
      const getComponentProps = computed(() => {
        const apiSelectProps: Recordable = {};
        apiSelectProps.cache = true;
        const compProps = {
          mode: 'multiple',
          labelInValue: true,
          api: getLabelList,
          resultField: 'list',
          labelField: 'name',
          valueField: 'id',
        };
        return {
          placeholder: 'Please Select',
          ...apiSelectProps,
          ...omit(compProps, 'onChange'),
          value: valueRef,
        };
      });
      // 单元格 style 设置
      const getWrapperStyle = computed((): CSSProperties => {
        return {
          width: 'calc(100% - 48px)',
        };
      });
      // 设置单元格 class
      const getWrapperClass = computed(() => {
        return `edit-cell-align-center`;
      });

      function onSelectChange() {
        selectedKeys.value = getSelectRowKeys();
      }

      function handleSelect() {
        const addresses = getSelectRows().map((data) => {
          return data['address'];
        });
        openDrawer(true, {
          ids: getSelectRowKeys(),
          addresses,
        });
      }

      function handleRunSuccess() {
        selectedKeys.value = [];
      }

      // 添加新增机器节点的modal框
      const [registerAddModal, { openModal: openAddModal }] = useModal();

      function handleAdd() {
        openAddModal(true);
      }

      function handleAddSuccess() {
        reload();
        const idempotenceInfo = useIdempotenceStore();
        idempotenceInfo.RefreshIdempotenceToken();
      }

      function handleInfo(record: Recordable) {
        Modal.info({
          title: '节点详情',
          content: h(JsonPreview, { data: record.information }),
        });
      }

      function handleTerminal(record: Recordable) {
        router.push({
          path: '/node/ssh',
          query: { address: record.address },
        });
      }

      function handleCollect(record: Recordable) {
        addCollect({ nodeId: record.id })
          .then(() => {
            notification.success({
              message: '恭喜',
              description: `收藏${record.address}成功，请在我的收藏查看`,
              duration: 4,
            });
          })
          .catch(() => {});
      }

      // 打开上传模态框
      function handleUpload(record: Recordable) {
        openUploaderModal(true, {
          record,
        });
      }

      function handleConnect({ values }) {
        visible.value = true;
        ifTerminal.value = true;
        sshPort.value = values.sshPort;
        username.value = values.username;
        address.value = values.address;
        password.value = values.password;
      }

      async function handleRefresh(record: Recordable) {
        await refreshNode(record.id)
          .then(() => {
            notification.success({
              message: '提醒',
              description: '已通知刷新，请稍后刷新页面',
            });
          })
          .catch((e) => {
            notification.error({
              message: '警告',
              description: `${e}`,
            });
          });
      }

      async function handleReboot() {
        const addresses = getSelectRows().map((data) => {
          return data['address'];
        });
        Modal.confirm({
          title: '危险操作',
          icon: createVNode(ExclamationCircleOutlined),
          content: `确定重启节点[${addresses.join(',')}]吗`,
          onOk() {
            rebootNode({
              ids: `${getSelectRowKeys().join(',')}`,
            }).catch((e) => {
              notification.error({
                message: '重启节点报错',
                description: `${e}`,
              });
            });
          },
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onCancel() {},
        });
      }

      async function handleDelete(record: Recordable) {
        await deleteNode({
          ids: `${record.id}`,
        }).then(() => {
          reload();
        });
        // console.log('点击了删除', record);
      }

      async function exportNodes() {
        const dataSource = await getNodeList({
          noPagination: true,
        });
        const { list } = dataSource;
        const dataList = list.map((d, index) => {
          let labels: any[] = [];
          const performances = ['高', '中', '低'];
          const healths = ['运行中', '异常', '已停机'];
          if (d.labels.length > 0) {
            d.labels.forEach((l) => {
              labels.push(l.name);
            });
          }
          return {
            id: (index + 1).toString(),
            address: d.address,
            asset: d.asset,
            manager: d.manager,
            region: d.region,
            metrics: d.metrics,
            createdAt: d.createdAt,
            creator: d.creator,
            labels: labels.join(','),
            performance: performances[d.performance],
            information: JSON.stringify(d.information),
            health: healths[d.health],
          };
        });
        jsonToSheetXlsx({
          data: dataList,
          header: {
            id: 'ID',
            address: 'IP地址',
            asset: '资产编号',
            health: '健康度',
            performance: '性能',
            labels: '标签',
            manager: '管理人',
            region: '所属地域',
            metrics: '机器概况',
            information: '具体信息',
            createdAt: '创建时间',
            creator: '创建人',
          },
          filename: '服务器列表.xlsx',
          json2sheetOpts: {
            // 指定顺序
            header: ['id'],
          },
        });
      }

      return {
        size: ref('small'),
        address,
        sshPort,
        username,
        password,
        visible,
        ifTerminal,
        prefixCls,
        valueRef,
        editableData,
        edit,
        editSubmit,
        editCancel,
        getComponentProps,
        getWrapperStyle,
        getWrapperClass,
        selectedKeys,
        registerDrawer,
        handleSelect,
        handleReboot,
        handleRunSuccess,
        onSelectChange,
        handleAdd,
        handleInfo,
        handleUpload,
        registerUploaderModal,
        registerTable,
        registerConfirmModal,
        registerTerminalModal,
        registerAddModal,
        exportNodes,
        openConfirmModal,
        closeTerminalModal,
        handleTerminal,
        handleRefresh,
        handleConnect,
        handleDelete,
        handleAddSuccess,
        handleCollect,
      };
    },
    created() {
      const idempotenceInfo = useIdempotenceStore();
      idempotenceInfo.RefreshIdempotenceToken();
    },
  });
</script>
<style lang="less" scoped>
  .vben-basic-table .ant-tag {
    margin-right: 2px;
    margin-bottom: 2px;
  }
</style>
