import { AutoComplete, Button, Form, Input, InputNumber, message, Select, Spin } from 'antd';
import { Fragment, useState } from 'react';

import { listContractApi } from '@/api/ttd_contract';

const { getUrlIconSocial } = listContractApi;

import MyUpLoad from '@/components/core/upload';

interface ICreateInterest {
  setNewInteres: (data: any) => void;
}

const CreateSocial = ({ setNewInteres }: ICreateInterest) => {
  const [form] = Form.useForm();
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      let icon_url = '';

      if (logoUrl) {
        const res = await getUrlIconSocial(logoUrl);

        if (res?.status === 200) {
          icon_url = res?.data?.url;
        } else {
          message.warning('Lỗi khi upload ảnh');
        }
      }

      const newInteres = {
        ...values,
        icon_url,
      };

      setNewInteres(newInteres);
      
    } catch (error) {
      console.log(error);
    }

    setLoading(false);

    // // console.log('Received values of form: ', newInteres);
    // setNewInteres(newInteres);
  };

  // console.log('logoUrl______________', logoUrl);

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

        <Form.Item name="icon_url" label="Icon:">
          <MyUpLoad setUrlLogo={setLogoUrl} />
        </Form.Item>

        <Form.Item style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
          <Spin spinning={loading}>
            <Button type="primary" htmlType="submit">
              Tạo
            </Button>
          </Spin>
        </Form.Item>
      </Form>
    </Fragment>
  );
};

export default CreateSocial;
