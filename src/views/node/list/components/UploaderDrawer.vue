<template>
  <BasicDrawer
    v-bind="$attrs"
    destroyOnClose
    @register="registerDrawer"
    :showFooter="false"
    title="批量运行脚本"
    width="35%"
  >
    <Divider>以下机器</Divider>
    <div>
      <Tag color="cyan" v-for="(item, index) in listNodes" :key="index">
        {{ item }}
      </Tag>
    </div>
    <Divider>上传以下脚本并执行</Divider>
    <BasicForm @register="registerForm">
      <template #customSlot="{ model, field }">
        <uploader
          v-model:value="model[field]"
          :options="options"
          :file-status-text="statusText"
          class="uploader-example"
          @file-success="onFileSuccess"
          @file-added="onFileAdded"
        >
          <uploader-unsupport />
          <uploader-drop>
            <uploader-btn :single="true" :attrs="attrs">选择shell文件</uploader-btn>
          </uploader-drop>
          <uploader-list />
        </uploader>
      </template>
    </BasicForm>
  </BasicDrawer>
</template>

<script lang="ts">
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { defineComponent, ref } from 'vue';
  import { Tag, Divider } from 'ant-design-vue';
  import { UploadFormSchema } from '/@/views/node/list/list.data';
  import { useGlobSetting } from '/@/hooks/setting';
  import { useUserStore } from '/@/store/modules/user';
  import { uploadMerge } from '/@/api/sys/upload';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    name: 'UploaderDrawer',
    components: { BasicDrawer, BasicForm, Tag, Divider },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const { createMessage, notification } = useMessage();
      const listNodes = ref<string[]>([]);
      const listNodeIds = ref<number[]>([]);
      const [registerForm, { resetFields, validate }] = useForm({
        labelWidth: 100,
        schemas: UploadFormSchema,
        showActionButtonGroup: false,
      });
      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        await resetFields();
        setDrawerProps({ confirmLoading: false });
        listNodes.value = data.addresses;
        listNodeIds.value = data.ids;
      });

      const options: any = {
        // 上传url
        target: useGlobSetting().apiUrl + '/upload/file',
        // 是否单个上传文件
        singleFile: true,
        // 上传文件时文件的参数名，默认file
        fileParameterName: 'file',
        // 是否开启服务器chunk校验
        testChunks: true,
        // 服务器分片校验自定义处理
        checkChunkUploadedByResponse: function (chunk: any, response: any) {
          const resp = JSON.parse(response);
          // 分片存在无需再次上传
          return (
            resp.code === 201 &&
            resp.result &&
            (resp.result.complete || (resp.result.uploaded || []).indexOf(chunk.offset + 1) >= 0)
          );
        },
        headers: {
          // 在header中添加的jwt token
          Authorization: 'Bearer ' + useUserStore().getToken,
        },
      };

      const attrs: any = {
        // limit file type
        accept: 'application/x-shellscript',
      };
      const statusText: any = {
        success: '成功',
        error: '出错',
        uploading: '上传中',
        paused: '暂停中',
        waiting: '等待中',
      };

      function onFileAdded(file: any) {
        const fileName: string = file.name;
        const fileExtension: string = fileName.substring(fileName.lastIndexOf('.') + 1);
        if (fileExtension != 'sh') {
          createMessage.error('您选择的不是shell文件，无法传输');
          file.error = true;
          file.paused = true;
          file.status = 'error';
        }
      }

      async function onFileSuccess(rootFile: any, file: any, response: any) {
        // console.log('value: ', await validate());
        const resp = JSON.parse(response);
        if (resp.code === 201 && resp.result && resp.result.complete) {
          const values = await validate();
          // 开始合并文件
          await uploadMerge({
            ...resp.result,
            addressIds: listNodeIds.value.join(','),
            remoteDir: values.remoteDir,
            runnable: values.runnable,
          })
            .then(() => {
              // closeDrawer();
              notification.success({
                message: '提醒',
                description: '文件已上传并执行成功',
              });
            })
            .catch((e) => {
              // closeDrawer();
              notification.error({
                message: '运行失败',
                description: `${e.message}`,
                duration: 7,
                style: { width: '100%' },
              });
            })
            .finally(() => {
              closeDrawer();
              emit('success');
            });
        }
      }
      return {
        registerDrawer,
        registerForm,
        listNodes,
        options,
        attrs,
        statusText,
        onFileAdded,
        onFileSuccess,
      };
    },
  });
</script>

<style lang="less">
  .uploader-example {
    font-size: 12px;

    .uploader-btn {
      margin-right: 4px;
      background-color: dodgerblue;
      color: white;
    }

    .uploader-file[status='error'] .uploader-file-retry {
      display: none;
    }
  }
</style>
