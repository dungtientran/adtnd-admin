import { UploadOutlined } from '@ant-design/icons';
import { Typography, Upload } from 'antd';
import axios from 'axios';
import { useState } from 'react';

import MyButton from '@/components/basic/button';

interface IMyUpload {
  setUrlLogo: (url: string) => void;
}

const MyUpLoad: React.FC<IMyUpload> = ({ setUrlLogo }) => {
  const [fileList, setFileList] = useState<any[]>([]);

  const handleChange = (info: any) => {
    setFileList(info.fileList);
  };

  const handleUpload = async (info: any) => {
    setFileList(info.fileList);

    const formData = new FormData();

    fileList.forEach(file => {
      formData.append('file', file.originFileObj);
      formData.append('upload_preset', 'qfxfgji7');
    });

    try {
      const response = await axios.post(`https://api.cloudinary.com/v1_1/dbkgkyh4h/image/upload`, formData);

      if (response.status === 200) {
        // console.log('Upload successful:', response);
        setUrlLogo(response.data.url);
      }
    } catch (error) {
    //   console.error('Error uploading:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <Typography.Text type="danger">Hình ảnh</Typography.Text>
      <Upload
        // action="https://api.cloudinary.com/v1_1/dbkgkyh4h/image/upload"
        listType="picture"
        maxCount={1}
        accept=".png, .jpg"
        onChange={handleUpload}
      >
        <MyButton icon={<UploadOutlined />}>Upload (Max: 1)</MyButton>
      </Upload>
    </div>
  );
};

export default MyUpLoad;
