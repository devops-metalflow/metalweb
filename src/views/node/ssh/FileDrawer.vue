<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" :title="getTitle" width="40vw">
    <div>
      <Spin tip="正在上传..." :spinning="isUpload" />
      <Upload
        v-if="!isUpload"
        class="sftp-btn"
        :showUploadList="false"
        name="file"
        :multiple="false"
        :customRequest="customUpload"
        @change="handleChange"
      >
        <a-button>
          <UploadOutlined />
          上传文件
        </a-button>
      </Upload>
      <a-button class="sftp-btn" @click="handleDiff">文件比对</a-button>
    </div>
    <div>
      <div v-if="!isEdit">
        <Tooltip>
          <template #title>双击可编辑路径</template>
          <Breadcrumb class="filepath" separator=">" @dblclick="doEdit">
            <template v-for="(p, index) in filePaths" :key="index">
              <breadcrumb-item href="" @click="getInitFiles(p.dir, sshId)">{{
                p.name
              }}</breadcrumb-item>
            </template>
            <a>
              <Icon class="edit" size="22" icon="path-edit|svg" @click="doEdit" />
            </a>
          </Breadcrumb>
        </Tooltip>
      </div>
      <a-input
        ref="input"
        v-else
        v-model:value="filepath"
        allow-clear="true"
        @blur="handleBlur"
        @pressEnter="getInitFiles(filepath, sshId)"
      />
    </div>
    <BasicTable
      v-if="fileData.length > 0"
      title=""
      :columns="columns"
      :dataSource="fileData"
      :show-index-column="false"
      :pagination="false"
      :canResize="true"
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
      <template #size="{ record }">
        <div v-if="record.type === 'd'"> - </div>
        <div v-else>
          {{ record.size }}
        </div>
      </template>
    </BasicTable>
  </BasicDrawer>
  <EditorModal @register="registerEditorModal" />
  <DiffModal @register="registerDiffModal" />
</template>
<script lang="ts">
  import { defineComponent, ref, nextTick, h } from 'vue';
  import { BasicColumn, BasicTable } from '/@/components/Table';
  import { notification, Upload, Tooltip, Spin } from 'ant-design-vue';
  import BreadcrumbItem from 'ant-design-vue/lib/breadcrumb/BreadcrumbItem';
  import Breadcrumb from 'ant-design-vue/lib/breadcrumb/Breadcrumb';
  import { UploadOutlined } from '@ant-design/icons-vue';
  import EditorModal from '/@/views/node/ssh/EditorModal.vue';
  import DiffModal from '/@/views/node/ssh/DiffModal.vue';
  import { useModal } from '/@/components/Modal';
  import { CustomMouseMenu } from '@howdyjs/mouse-menu';
  import { downloadFile, getDirInfo, uploadFile } from '/@/api/node/node';
  import { Icon } from '/@/components/Icon';
  import icons from '@exuanbo/file-icons-js/dist/js/file-icons';
  import '@exuanbo/file-icons-js/dist/css/file-icons.min.css';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  export default defineComponent({
    name: 'FileManagerDrawer',
    components: {
      Icon,
      BasicTable,
      EditorModal,
      DiffModal,
      BasicDrawer,
      Breadcrumb,
      BreadcrumbItem,
      Upload,
      UploadOutlined,
      Tooltip,
      Spin,
    },
    emits: ['success', 'register'],
    setup() {
      const getTitle = ref<string>('');
      const fileData = ref([]);
      const fileIcons = ref({});
      const filePaths = ref<{ dir: string; name: string }[]>([]);
      const filepath = ref('');
      const sshId = ref<string>('');
      const dom = ref();
      const diffPaths = ref<string[]>([]);
      const isEdit = ref<boolean>(false);
      const input = ref();
      const isUpload = ref<boolean>(false);

      const [registerDrawer, { setDrawerProps }] = useDrawerInner(async (data) => {
        getTitle.value = `${data.address} 的文件管理器`;
        sshId.value = data.sshId;
        isEdit.value = false;
        setDrawerProps({
          confirmLoading: false,
          maskClosable: false,
          mask: false,
        });

        getInitFiles(`/home/${data.user}`, data.sshId)
          .then(() => {
            setDrawerProps({ loading: false, confirmLoading: false });
          })
          .catch(() => {
            setDrawerProps({ loading: false, confirmLoading: false });
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
                    const blob = new Blob([res], { type: res.type }); // 构造一个blob对象来处理数据，并设置文件类型
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
          width: '40%',
          slots: { title: 'name', customRender: 'name' },
          align: 'left',
        },
        {
          title: '大小',
          dataIndex: 'size',
          key: 'size',
          slots: { title: 'size', customRender: 'size' },
        },
        {
          title: '修改时间',
          dataIndex: 'mod_time',
          key: 'mod_time',
          width: '30%',
        },
        {
          title: '权限',
          dataIndex: 'mode',
          key: 'mode',
        },
      ];

      const getInitFiles = async (filePath: string, sshId: string) => {
        try {
          isEdit.value = false;
          // 先排空原来的一些值
          fileIcons.value = [];
          fileData.value = [];
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
        } catch (error) {
          notification.error({
            message: '未找到文件目录',
            description: `${filePath}`,
            duration: 4,
            style: { width: '100%' },
          });
        }
      };

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

      function doEdit() {
        isEdit.value = true;
        filepath.value = filePaths.value[filePaths.value.length - 1].dir;
        nextTick(() => {
          input.value.focus();
        });
      }
      function handleBlur() {
        isEdit.value = false;
      }

      function handleChange() {
        isUpload.value = true;
      }
      const customUpload = async (e) => {
        const formData = new FormData();
        formData.append('file', e.file);
        let templatePath = filePaths.value[filePaths.value.length - 1].dir;
        const filename = e.file.name;
        formData.append('path', templatePath);
        formData.set('filename', filename);
        formData.append('sshId', sshId.value);

        uploadFile(formData)
          .then(() => {
            getInitFiles(templatePath, sshId.value);
            notification.success({
              message: `恭喜，上传${filename}成功`,
              duration: 3,
            });
            isUpload.value = false;
          })
          .catch((err) => {
            console.log('上传失败', err);
            isUpload.value = false;
          });
      };

      return {
        getInitFiles,
        onContextMenu,
        openFile,
        sshId,
        registerEditorModal,
        registerDiffModal,
        registerDrawer,
        handleDiff,
        getTitle,
        columns,
        fileData,
        filePaths,
        filepath,
        isEdit,
        doEdit,
        handleBlur,
        input,
        handleChange,
        customUpload,
        isUpload,
      };
    },
  });
</script>
<style>
  .sftp-btn {
    margin-left: 10px;
    margin-bottom: 10px;
  }
  /* 覆盖Ant Design Vue的Breadcrumb样式 */
  .filepath {
    margin-left: 10px;
    border: 1px solid #d9d9d9; /* 设置边框样式，例如1px实线灰色边框 */
    border-radius: 4px; /* 如果需要圆角边框 */
    /* 根据需要设置内边距 */
    padding: 6px 0 6px 10px;
    background-color: #fff; /* 设置背景颜色，这里使用白色 */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 如果需要添加阴影效果 */
  }

  /* 覆盖Breadcrumb中的每一项样式 */
  .filepath > span {
    margin: 0 8px; /* 设置分隔符两侧的间距 */
    color: #333; /* 设置文本颜色 */
  }

  /* 覆盖Breadcrumb中链接样式 */
  .filepath > span a {
    color: black; /* 设置链接颜色，这里使用Ant Design Vue的主题色 */
    text-decoration: none; /* 移除下划线 */
  }

  /* 鼠标悬停时改变链接样式 */
  .filepath > span a:hover {
    color: #40a9ff; /* 鼠标悬停时的链接颜色 */
  }
  .edit {
    float: right;
    right: 2px;
  }
</style>
