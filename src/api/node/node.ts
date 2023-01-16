import { defHttp } from '/@/utils/http/axios';
import {
  NodeListRequestModel,
  NodeListGetResultModel,
  NodeCreateRequestModel,
  NodeUpdateRequestModel,
  NodeIdsRequestModel,
  FilepathModel,
  UpdateNodeShellModel,
  NodeShellConnectModel,
  ResizeShellModel,
} from '/@/api/node/model/nodeModel';

enum Api {
  GetNodeList = '/node/list',
  CreateNode = '/node/create',
  UpdateNode = '/node/update',
  DeleteNode = '/node/delete/batch',
  RefreshNode = '/node/refresh',
  RebootNode = '/node/reboot',
  NodeShellConnect = '/node/shell/connect',
  GetNodeDirInfo = '/node/shell/dir',
  GetNodeFileContent = '/node/shell/file',
  DownloadFile = '/node/shell/file/download',
  UpdateFile = '/node/shell/file/update',
  ResizeShell = '/node/shell/ws/resize',
}

export const nodeShellConnect = (params?: NodeShellConnectModel) =>
  defHttp.post({
    url: Api.NodeShellConnect,
    params,
  });

export const getNodeList = (params?: NodeListRequestModel) =>
  defHttp.get<NodeListGetResultModel>({
    url: Api.GetNodeList,
    params,
  });

export const getDirInfo = (params: FilepathModel) =>
  defHttp.get({
    url: Api.GetNodeDirInfo,
    params,
  });

export const getFileContent = (params: FilepathModel) =>
  defHttp.get({
    url: Api.GetNodeFileContent,
    params,
  });

export const resizeShell = (params: ResizeShellModel) =>
  defHttp.patch({
    url: Api.ResizeShell,
    params,
  });

export const downloadFile = (params: FilepathModel) =>
  defHttp.post(
    {
      url: Api.DownloadFile,
      params,
    },
    { isTransformResponse: false }
  );

export const updateFile = (params: UpdateNodeShellModel) =>
  defHttp.patch({
    url: Api.UpdateFile,
    params,
  });

export const createNode = (params: NodeCreateRequestModel) =>
  defHttp.post({
    url: Api.CreateNode,
    params,
  });

export const rebootNode = (params: NodeIdsRequestModel) =>
  defHttp.post({
    url: Api.RebootNode,
    params,
    timeout: 1000 * 60,
  });

export const updateNode = (id: number | string, params: NodeUpdateRequestModel) =>
  defHttp.patch({
    url: `${Api.UpdateNode}/${id}`,
    params,
  });

export const refreshNode = (id: number | string) =>
  defHttp.patch({
    url: `${Api.RefreshNode}/${id}`,
  });

export const deleteNode = (params: NodeIdsRequestModel) =>
  defHttp.delete({
    url: Api.DeleteNode,
    params,
  });
