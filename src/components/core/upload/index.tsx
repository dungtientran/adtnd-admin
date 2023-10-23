import { UploadOutlined } from '@ant-design/icons';
import { Avatar, Image, message, Space, Typography, Upload } from 'antd';
import axios from 'axios';
import { Fragment, useEffect, useState } from 'react';

import MyButton from '@/components/basic/button';

interface IMyUpload {
  setUrlLogo: (url: any) => void;
  record?: any;
  isTitle?: boolean;
}

const MyUpLoad: React.FC<IMyUpload> = ({ setUrlLogo, record, isTitle = true }) => {
  const [fileList, setFileList] = useState<any[]>([]);

  const checkImageType = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file types!');
    }

    return isJpgOrPng;
  };

  const handleChange = (info: any) => {
    if (checkImageType(info.file)) {
      setFileList(info.fileList);
      const formData = new FormData();

      formData.append('file', info.file);
      formData.append('upload_preset', 'qfxfgji7');
      setUrlLogo(formData);
    }
  };

  const handleUpload = async (info: any) => {
    if (checkImageType(info.file)) {
      setFileList(info.fileList);
      const formData = new FormData();

      formData.append('file', info.file);
      formData.append('upload_preset', 'qfxfgji7');

      try {
        const response = await axios.post(`https://api.cloudinary.com/v1_1/dbkgkyh4h/image/upload`, formData);

        if (response.status === 200) {
          // console.log('Upload successful:', response);
          setUrlLogo(response.data.url);
        }
      } catch (error) {
        //   console.error('Error uploading:', error);
      }
    }

    return false;
  };

  useEffect(() => {
    if (fileList.length === 0) {
      setUrlLogo('');
    }
  }, [fileList]);

  console.log('isTitle_______________', isTitle);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {record?.logo_url && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
          <Typography.Text type="success">Logo hiện tại: </Typography.Text>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <Image src={record.logo_url} width={100} height={100} style={{ borderRadius: '8px' }} />
            <Typography.Text>{record.name}</Typography.Text>
          </div>
        </div>
      )}
      {isTitle && (
        <Fragment>
          {record?.logo_url ? (
            <Typography.Text type="danger">Thay đổi</Typography.Text>
          ) : (
            <Fragment>
              <Typography.Text>{record?.name}</Typography.Text>
              <Typography.Text type="warning">Hình ảnh</Typography.Text>
            </Fragment>
          )}
        </Fragment>
      )}

      <Upload
        action=""
        listType="picture"
        maxCount={1}
        accept="image/png, image/gif, image/jpeg"
        onChange={handleChange}
        beforeUpload={_ => {
          return false;
        }}
        // fileList={[...fileList]}
      >
        <Space size="large">
          <MyButton icon={<UploadOutlined />}>Upload (Max: 1)</MyButton>
        </Space>
      </Upload>
    </div>
  );
};

export default MyUpLoad;
