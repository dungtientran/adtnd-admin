import { message } from 'antd';

export const checkImageType = (file: any) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file types!');
  }

  return isJpgOrPng;
};
