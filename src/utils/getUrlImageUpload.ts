import { message } from 'antd';
import axios from 'axios';

import { listUploadApi } from '@/api/ttd_upload.api';

const { getUrlImage, getUrlS3 } = listUploadApi;

const IMAGE_BUCKET_LOGO = import.meta.env.VITE_IMAGE_BUCKET as string;
const IMAGE_BUCKET_CHART = import.meta.env.VITE_IMAGE_BUCKET_CHART as string;

// eslint-disable-next-line prefer-const

export const getUrlImageUpload = async (code: string, files: any, s3?: 'logo' | 'chart') => {
  let IMAGE_BUCKET = undefined;

  if (s3 === 'chart') {
    IMAGE_BUCKET = IMAGE_BUCKET_CHART;
  } else {
    IMAGE_BUCKET = IMAGE_BUCKET_LOGO;
  }

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

    return imageUrl?.url;
  } catch (error: any) {
    console.log(error);
    message.error(`${error?.message}` || 'Upload thất bại');

    return false;
  }
};
