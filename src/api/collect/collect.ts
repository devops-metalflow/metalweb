import { defHttp } from '/@/utils/http/axios';
import { CollectNodeIdModal, MyCollections } from '/@/api/collect/model/collectModel';

enum Api {
  GetMyCollections = '/collect/my',
  AddCollect = '/collect/my',
  RemoveCollect = '/collect/delete/my',
}

export const addCollect = (params: CollectNodeIdModal) =>
  defHttp.post({
    url: Api.AddCollect,
    params,
  });

export const getMyCollect = () =>
  defHttp.get<MyCollections>({
    url: Api.GetMyCollections,
  });

export const removeCollect = (params: CollectNodeIdModal) =>
  defHttp.delete({
    url: Api.RemoveCollect,
    params,
  });
