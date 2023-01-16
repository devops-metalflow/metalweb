import { defHttp } from '/@/utils/http/axios';

import {
  LabelListRequestModel,
  LabelListGetResultModel,
  LabelCreateRequestModel,
  LabelUpdateRequestModel,
  LabelDeleteRequestModel,
} from '/@/api/back/model/labelModel';

enum Api {
  GetLabelList = '/label/list',
  CreateLabel = '/label/create',
  UpdateLabel = '/label/update/',
  DeleteLabel = '/label/delete/batch',
}

export const getLabelList = (params?: LabelListRequestModel) =>
  defHttp.get<LabelListGetResultModel>({
    url: Api.GetLabelList,
    params,
  });

export const createLabel = (params: LabelCreateRequestModel) =>
  defHttp.post({
    url: Api.CreateLabel,
    params,
  });

export const updateLabel = (id: number, params: LabelUpdateRequestModel) =>
  defHttp.patch({
    url: `${Api.UpdateLabel}${id}`,
    params,
  });

export const deleteLabel = (params: LabelDeleteRequestModel) =>
  defHttp.delete({
    url: Api.DeleteLabel,
    params,
  });
