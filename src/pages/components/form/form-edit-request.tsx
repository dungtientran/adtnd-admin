/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Form, Input, Switch } from 'antd';
import { Fragment, useEffect } from 'react';

interface IEditRequest {
  setUpdateDataSp: (updateData: any) => void;
  initForm?: any;
  // setSaleCustomer: (sale: any) => void;
}

const EditRequest: React.FC<IEditRequest> = ({ setUpdateDataSp, initForm }) => {
  useEffect(() => {
    if (initForm) {
      form.setFieldsValue(initForm);
    } else {
      form.resetFields();
    }
  }, [initForm]);
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    // console.log('Received values of form: ', values);
    setUpdateDataSp(values);
  };

  return (
    <Fragment>
      <Form
        //   {...formItemLayout}
        form={form}
        name="register"
        layout="vertical"
        autoComplete="off"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
        scrollToFirstError
        // initialValues={initValue}
      >
        <Form.Item
          name="name"
          label="Tên khách hàng"
          rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!', whitespace: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              type: 'email',
              message: 'Không đúng định dạng Email!',
            },
            {
              required: true,
              message: 'Vui lòng nhập E-mail!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phone_number"
          label="SĐT"
          rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
        >
          <Input style={{ width: '100%' }} type="number" />
        </Form.Item>
        <Form.Item name="address" label="Địa chỉ">
          <Input />
        </Form.Item>

        <Form.Item name="type" label="Loại hỗ trợ">
          <Input />
        </Form.Item>

        <Form.Item name="is_contact" label="Liên lạc" valuePropName="checked">
          <Switch unCheckedChildren="Chưa liên lạc" checkedChildren="Đã liên lạc" />
        </Form.Item>
        <Form.Item style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '' }}>
          <Button type="primary" htmlType="submit">
            Lưu
          </Button>
        </Form.Item>
      </Form>
    </Fragment>
  );
};

export default EditRequest;
