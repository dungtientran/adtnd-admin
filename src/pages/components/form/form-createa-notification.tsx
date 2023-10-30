import type { UseMutationResult } from '@tanstack/react-query';

import { Button, Form, Input, Select, Spin } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { Fragment, useEffect } from 'react';

interface ICreateUser {
  initForm?: any;
  useSale: () => {
    create: UseMutationResult<any, any, any, unknown>;
    update: UseMutationResult<any, any, any, unknown>;
  };
}

const NotificationForm: React.FC<ICreateUser> = ({ initForm, useSale }) => {
  const { create, update } = useSale();

  useEffect(() => {
    if (initForm) {
      const newInit = {
        ...initForm,
        role_id: initForm?.role?.name,
        level: initForm?.SaleLevel?.level,
      };

      form.setFieldsValue(newInit);
    } else {
      form.resetFields();
    }
  }, [initForm]);
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    if (!initForm) {
      return create.mutate(values);
    } else {
      return update.mutate({
        ...values,
        id: initForm?.id,
      });
    }
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

        <Form.Item name="description" label="Mô tả: " rules={[{ required: true, message: 'Không được bỏ trống!' }]}>
          <Input />
        </Form.Item>

        <Form.Item
          name="notification_category_id"
          label="Loại: "
          rules={[{ required: true, message: 'Không được bỏ trống!' }]}
        >
          <Select
            // defaultValue={1}
            style={{ width: 120 }}
            //  onChange={handleChange}
            placeholder="Chọn loại"
            options={[
              { value: 2, label: 'Hệ thống' },
              { value: 1, label: 'Chung' },
            ]}
          />
        </Form.Item>

        <Form.Item name="img_url" label="Url hình ảnh: ">
          <Input />
        </Form.Item>

        <Form.Item name="extend_url" label="Url mở rộng: ">
          <Input />
        </Form.Item>

        <Form.Item name="content" label="Nội dung: ">
          <TextArea />
        </Form.Item>

        <Form.Item style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '' }}>
          <Spin spinning={initForm ? update.isLoading : create.isLoading}>
            <Button type="primary" htmlType="submit">
              {initForm ? 'Lưu' : 'Tạo mới'}
            </Button>
          </Spin>
        </Form.Item>
      </Form>
    </Fragment>
  );
};

export default NotificationForm;
