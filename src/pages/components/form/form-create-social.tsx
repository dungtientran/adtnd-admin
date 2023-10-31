import type { UseMutationResult } from '@tanstack/react-query';

import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, Spin, Upload } from 'antd';
import { Fragment, useState } from 'react';

import MyButton from '@/components/basic/button';
import { checkImageType } from '@/utils/checkImageType';
import { getUrlImageUpload } from '@/utils/getUrlImageUpload';

interface ICreateInterest {
  create: UseMutationResult<any, unknown, any, unknown>
}

const CreateSocial = ({ create }: ICreateInterest) => {
  const [form] = Form.useForm();
  const [files, setFiles] = useState<any>(undefined);
  const [loading, setLoading] = useState(false);

  const handleChange = (info: any) => {
    if (checkImageType(info.file)) {
      setFiles(info.file);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);

    try {
      const icon_url = await getUrlImageUpload('icon-support', files);

      const newInteres = {
        ...values,
        icon_url,
      };

      create.mutate(newInteres);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <Fragment>
      <Form
        form={form}
        name="register"
        layout="vertical"
        autoComplete="off"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
        scrollToFirstError
      >
        <Form.Item name="title" label="Tiêu đề: " rules={[{ required: true, message: 'Không được bỏ trống!' }]}>
          <Input />
        </Form.Item>

        <Form.Item name="link_url" label="URL:" rules={[{ required: true, message: 'Không được bỏ trống!' }]}>
          <Input />
        </Form.Item>

        <Form.Item name="icon_url" label="Icon:" rules={[{ required: true, message: 'Không được bỏ trống!' }]}>
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
            <MyButton icon={<UploadOutlined />}>Upload (Max: 1)</MyButton>
          </Upload>
        </Form.Item>

        <Form.Item style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
          <Spin spinning={loading}>
            <Button
              type="primary"
              htmlType="submit"
              //  disabled={files ? true : false}
            >
              Tạo
            </Button>
          </Spin>
        </Form.Item>
      </Form>
    </Fragment>
  );
};

export default CreateSocial;
