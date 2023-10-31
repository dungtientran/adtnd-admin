import type { UseMutationResult } from '@tanstack/react-query';

import { UploadOutlined } from '@ant-design/icons';
import { Button, Image, message, Space, Spin, Typography, Upload } from 'antd';
import { Fragment, useState } from 'react';

import MyButton from '@/components/basic/button';
import { checkImageType } from '@/utils/checkImageType';
import { getUrlImageUpload } from '@/utils/getUrlImageUpload';

interface IMyUpload {
  record?: any;
  isTitle?: boolean;
  useStock: () => UseMutationResult<
    any,
    any,
    {
      logo_url: string;
      stock_id: string;
    },
    unknown
  >;
}

const MyUpLoad: React.FC<IMyUpload> = ({ record, isTitle = true, useStock }) => {
  const [files, setFiles] = useState<any>();
  const [spining, setSpining] = useState<boolean>(false);

  const updateLogo = useStock();

  const handleChange = (info: any) => {
    if (checkImageType(info.file)) {
      setFiles(info.file);
    }
  };

  const handleSubmit = async () => {
    setSpining(true);

    try {
      const logo_url = await getUrlImageUpload(record?.code, files);

      const dataUpload = {
        logo_url,
        stock_id: record?.id,
      };

      updateLogo.mutate(dataUpload);
    } catch (error: any) {
      console.log(error);
      message.error('Upload image thất bại!');
    }

    setSpining(false);
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
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
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Spin spinning={spining}>
          <Button type="primary" onClick={handleSubmit}>
            Upload
          </Button>
        </Spin>
      </div>
    </Space>
  );
};

export default MyUpLoad;
