<template>
  <BasicModal
    v-bind="$attrs"
    width="900px"
    destroyOnClose
    @register="registerModal"
    :title="getTitle"
    :showOkBtn="false"
    :showCancelBtn="false"
  >
    <div>
      <RadioGroup>
        <template v-for="(p, index) in filePaths" :key="index">
          <RadioButton value="small" @click="getInitFiles(p.dir, sshId)">{{ p.name }}</RadioButton>
        </template>
      </RadioGroup>
      <div style="float: right">
        <Tooltip title="文件比对" placement="bottom">
          <a-button
            size="small"
            shape="circle"
            preIcon="diff|svg"
            type="primary"
            @click="handleDiff"
          />
        </Tooltip>
      </div>
    </div>
    <BasicTable
      v-if="fileData.length > 0"
      title=""
      :columns="columns"
      :dataSource="fileData"
      :show-index-column="false"
      :pagination="false"
      :canResize="true"
      :showHeader="false"
      :striped="false"
    >
      <template #name="{ record }">
        <a
          v-if="record.type === 'd'"
          @dblclick="getInitFiles(record.path, sshId)"
          style="height: 100%"
        >
          {{ record.name }}
        </a>
        <a
          v-else
          ref="dom"
          @dblclick="openFile(record.path, sshId)"
          @contextmenu="onContextMenu($event, record.path, record.name)"
        >
          {{ record.name }}
        </a>
      </template>
    </BasicTable>
  </BasicModal>
  <EditorModal @register="registerEditorModal" />
  <DiffModal @register="registerDiffModal" />
</template>

<script lang="ts">
  import { defineComponent, h, ref } from 'vue';
  import { BasicModal, useModal, useModalInner } from '/@/components/Modal';
  import { BasicColumn, BasicTable } from '/@/components/Table';
  import { downloadFile, getDirInfo } from '/@/api/node/node';
  import { CustomMouseMenu } from '@howdyjs/mouse-menu';
  import { Tooltip } from 'ant-design-vue';
  import RadioButton from 'ant-design-vue/lib/radio/RadioButton';
  import RadioGroup from 'ant-design-vue/lib/radio/Group';
  import EditorModal from './EditorModal.vue';
  import DiffModal from './DiffModal.vue';
  import icons from '@exuanbo/file-icons-js';
  import '@exuanbo/file-icons-js/dist/css/file-icons.min.css';
  import { Icon } from '/@/components/Icon';

  export default defineComponent({
    name: 'FileManagerModal',
    components: {
      Tooltip,
      BasicModal,
      BasicTable,
      EditorModal,
      DiffModal,
      RadioButton,
      RadioGroup,
    },
    emits: ['success', 'register'],
    setup() {
      const getTitle = ref<string>('');
      const fileData = ref([]);
      const fileIcons = ref({});
      const filePaths = ref<{ dir: string; name: string }[]>([]);
      const sshId = ref<string>('');
      const dom = ref();
      const diffPaths = ref<string[]>([]);

      const [registerModal, { setModalProps }] = useModalInner(async (data) => {
        sshId.value = data.sshId;
        getTitle.value = `${data.address}文件管理`;
        setModalProps({ loading: true, confirmLoading: true });
        getInitFiles(`/home/${data.user}`, data.sshId)
          .then(() => {
            setModalProps({ loading: false, confirmLoading: false });
          })
          .catch(() => {
            setModalProps({ loading: false, confirmLoading: false });
          });
      });

      const onContextMenu = (e, path: string, name: string) => {
        e.preventDefault();
        const MouseMenuCtx = CustomMouseMenu({
          el: dom.value,
          menuList: [
            {
              label: '下载',
              fn: () => {
                downloadFile({
                  path: path,
                  sshId: sshId.value,
                })
                  .then((res) => {
                    if (!res) return;
                    const blob = new Blob([res]); // 构造一个blob对象来处理数据，并设置文件类型
                    const href = URL.createObjectURL(blob); //创建新的URL表示指定的blob对象
                    const a = document.createElement('a'); //创建a标签
                    a.style.display = 'none';
                    a.href = href; // 指定下载链接
                    a.download = name; //指定下载文件名
                    a.click(); //触发下载
                    URL.revokeObjectURL(a.href); //释放URL对象
                    // 这里也可以不创建a链接，直接window.open(href)也能下载
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              },
            },
            {
              label: '加入比对',
              fn: () => {
                // 将元素入栈
                diffPaths.value.push(path);
              },
            },
          ],
        });
        const { x, y } = e;
        MouseMenuCtx.show(x, y);
      };

      const columns: BasicColumn[] = [
        {
          title: '',
          dataIndex: 'type',
          key: 'type',
          align: 'left',
          width: 18,
          customRender: ({ record }) => {
            if (record.type == 'd') {
              return h(Icon, { icon: 'files-svg|svg' });
            } else {
              return h('i', {
                class: record.iconClass,
              });
            }
          },
        },
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
          align: 'left',
          width: '60%',
          slots: { title: 'name', customRender: 'name' },
        },
        {
          title: '更改时间',
          dataIndex: 'mod_time',
          key: 'mod_time',
          align: 'right',
        },
        {
          title: '大小',
          dataIndex: 'size',
          key: 'size',
          align: 'right',
        },
        {
          title: '权限',
          dataIndex: 'mode',
          key: 'mode',
          align: 'right',
        },
      ];

      async function getInitFiles(filePath: string, sshId: string) {
        // 先排空原来的一些值
        fileIcons.value = [];
        fileData.value = [];
        filePaths.value = [];
        const pathInfos = await getDirInfo({ path: filePath, sshId: sshId });
        filePaths.value = pathInfos.paths;
        if (pathInfos.files) {
          const names = pathInfos.files.map((v) => {
            return v.name;
          });
          for (const n of names) {
            fileIcons.value[n] = await icons.getClass(n);
          }
          if (fileIcons.value) {
            fileData.value = pathInfos.files.map((v) => {
              return {
                ...v,
                iconClass: fileIcons.value[v.name],
              };
            });
          }
        }
      }

      const [registerEditorModal, { openModal: openEditorModal }] = useModal();
      const [registerDiffModal, { openModal: openDiffModal }] = useModal();
      function handleDiff() {
        openDiffModal(true, {
          sshId: sshId.value,
          newValPath: diffPaths.value.pop(),
          oldValPath: diffPaths.value.pop(),
        });
      }

      function openFile(filepath: string, sshId: string) {
        openEditorModal(true, {
          filepath,
          sshId,
        });
      }

      return {
        getInitFiles,
        registerModal,
        onContextMenu,
        openFile,
        sshId,
        registerEditorModal,
        registerDiffModal,
        handleDiff,
        getTitle,
        columns,
        fileData,
        filePaths,
      };
    },
  });
</script>

<style scoped></style>
