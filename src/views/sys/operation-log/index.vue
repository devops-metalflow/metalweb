<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button @click="exportLogs"> 导出 </a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: '请求头',
              icon: 'ant-design:eye-outlined',
              onClick: checkHeader.bind(null, record),
            },
            {
              label: '请求体',
              icon: 'ant-design:eye-outlined',
              onClick: checkBody.bind(null, record),
            },
            {
              label: '响应',
              icon: 'ant-design:eye-outlined',
              onClick: checkResp.bind(null, record),
            },
          ]"
        />
      </template>
    </BasicTable>
  </div>
</template>

<script>
  import { defineComponent, h } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { columns, searchFormSchema } from './operation-log.data';
  import { getOperationLogList } from '/@/api/sys/operation-log';
  import { Modal } from 'ant-design-vue';
  import { JsonPreview } from '../../../components/CodeEditor';
  import { jsonToSheetXlsx } from '/@/components/Excel';

  export default defineComponent({
    name: 'OperationLog',
    components: { BasicTable, TableAction },
    setup() {
      const [registerTable, { reload }] = useTable({
        title: '操作日志列表(未列出GET请求)',
        columns,
        rowKey: 'id',
        formConfig: {
          labelWidth: 80,
          schemas: searchFormSchema,
        },
        useSearchForm: true,
        api: getOperationLogList,
        showTableSetting: true,
        bordered: true,
        showIndexColumn: false,
        actionColumn: {
          width: 230,
          title: '请求及响应数据',
          dataIndex: 'action',
          slots: { customRender: 'action' },
        },
      });

      function checkHeader(record) {
        Modal.info({
          title: '请求头',
          width: '50%',
          content: h(JsonPreview, { data: record.header }),
        });
      }

      function checkBody(record) {
        Modal.info({
          title: '请求参数',
          content: h(JsonPreview, { data: record.body }),
        });
      }

      function checkResp(record) {
        Modal.info({
          title: '请求参数',
          content: h(JsonPreview, { data: record.data }),
        });
      }

      async function exportLogs() {
        const dataSource = await getOperationLogList({
          noPagination: true,
        });
        const { list } = dataSource;
        const dataList = list.map((d) => {
          return {
            ...d,
            data: JSON.stringify(d.data),
            header: JSON.stringify(d.header),
            body: JSON.stringify(d.body),
          };
        });
        jsonToSheetXlsx({
          data: dataList,
          header: {
            id: 'ID',
            apiDesc: '请求描述',
            path: '请求路径',
            method: '请求方式',
            header: '请求头',
            body: '请求体',
            status: '响应状态',
            data: '响应体',
            username: '工号',
            roleName: '所属角色',
            latency: '请求耗时(ms)',
            userAgent: '浏览器类型',
            createdAt: '请求时间',
          },
          filename: '用户操作记录.xlsx',
          json2sheetOpts: {
            // 指定顺序
            header: ['id'],
          },
        });
      }

      return {
        registerTable,
        reload,
        checkHeader,
        checkBody,
        checkResp,
        exportLogs,
      };
    },
  });
</script>

<style scoped></style>
