import { message } from 'antd';
import axios from 'axios';

import { listUploadApi } from '@/api/ttd_upload.api';

const { getUrlImage, getUrlS3 } = listUploadApi;

const IMAGE_BUCKET = import.meta.env.VITE_IMAGE_BUCKET as string;

export const getUrlImageUpload = async (code: string, files: any) => {
  try {
    const payload = {
      Bucket: `${IMAGE_BUCKET}/${code}`,
      Key: files.name,
      ContentType: files.type,
    };
    const getUrlSeverS3 = await getUrlS3(payload);
    const urlS3 = getUrlSeverS3?.url;

    const options = {
      headers: {
        'Content-Type': files.type,
      },
    };

    await axios.put(urlS3, files, options);
    const imageUrl = await getUrlImage(payload);

    console.log('imageUrl____________________', imageUrl);

    return imageUrl?.url;
  } catch (error: any) {
    console.log(error);
    message.error(`${error?.message}` || 'Xóa thất bại');
  }
};
