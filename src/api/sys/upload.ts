import { defHttp } from '/@/utils/http/axios';

enum Api {
  UploadMerge = '/upload/merge',
}

/**
 * @description: Upload interface
 */
export const uploadMerge = (data: any) =>
  defHttp.post({
    url: Api.UploadMerge,
    data,
    timeout: 1000 * 60,
  });
