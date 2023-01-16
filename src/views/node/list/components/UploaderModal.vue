<template>
  <BasicModal
    v-bind="$attrs"
    destroyOnClose
    @register="registerModal"
    :title="getTitle"
    :showCancelBtn="false"
    :showOkBtn="false"
  >
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
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useGlobSetting } from '/@/hooks/setting';
  import { useUserStore } from '/@/store/modules/user';
  import { uploadMerge } from '/@/api/sys/upload';
  import { UploadFormSchema } from '/@/views/node/list/list.data';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    name: 'UploaderModal',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup: function () {
      const { createMessage, notification } = useMessage();
      const addressId = ref<number>(0);
      const getTitle = ref<string>('');

      const [registerForm, { resetFields, validate }] = useForm({
        labelWidth: 100,
        schemas: UploadFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 23,
        },
      });

      const [registerModal, { closeModal }] = useModalInner(async (data) => {
        await resetFields();
        addressId.value = data.record.id;
        getTitle.value = `上传shell脚本到${data.record.address}并执行`;
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
            addressIds: `${addressId.value}`,
            remoteDir: values.remoteDir,
            runnable: values.runnable,
          })
            .then(() => {
              notification.success({
                message: '提醒',
                description: '文件已上传并执行成功',
              });
            })
            .catch((e) => {
              notification.error({
                message: '运行失败',
                description: `${e}`,
                duration: 7,
                style: { width: '100%' },
              });
            })
            .finally(() => {
              closeModal();
            });
        }
      }

      return {
        registerForm,
        registerModal,
        getTitle,
        options,
        attrs,
        statusText,
        onFileAdded,
        onFileSuccess,
        closeModal,
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
