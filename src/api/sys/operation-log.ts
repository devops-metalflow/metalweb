import {
  OperationLogListGetResultModel,
  OperationLogListRequestModel,
} from '/@/api/sys/model/operationLogModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetOperationLogList = '/operation/log/list',
}

export const getOperationLogList = (params: OperationLogListRequestModel) =>
  defHttp.get<OperationLogListGetResultModel>({
    url: Api.GetOperationLogList,
    params,
  });
