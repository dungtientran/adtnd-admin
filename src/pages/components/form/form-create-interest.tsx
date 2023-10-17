import { AutoComplete, Button, Form, Input, InputNumber, Select } from 'antd';
import { Fragment, useState } from 'react';

interface ICreateInterest {
  setNewInteres: (data: any) => void;
}

const CreateInterest = ({ setNewInteres }: ICreateInterest) => {
  const [form] = Form.useForm();
  const [option2, setOption2] = useState([
    {
      id: 'admin',
      value: 'Lợi nhuận',
    },
    {
      id: 'sale',
      value: 'Gói dịch vụ',
    },
  ]);

  const onFinish = (values: any) => {
    const newInteres = {
      ...values,
      subscription_product_id: 'vip',
      type: 'profit',
    };

    // console.log('Received values of form: ', newInteres);
    setNewInteres(newInteres);
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
        {/* <Form.Item
          name="role_id"
          label="Tiêu chí"
          rules={[{ required: true, message: 'Vui lòng nhập chức vụ !', whitespace: true }]}
        >
          <Select
            defaultValue="Lợi nhuận"
            style={{ width: '' }}
            //   onChange={handleChange}
            options={option2}
          />
        </Form.Item>
        <Form.Item
          name="role_id"
          label="Gói dịch vụ"
          rules={[{ required: true, message: 'Vui lòng nhập chức vụ !', whitespace: true }]}
        >
          <Select
            defaultValue="jack"
            style={{ width: '' }}
            //   onChange={handleChange}
            options={[
              { value: 'jack', label: 'Vip' },
              { value: 'lucy', label: 'Premium' },
            ]}
          />
        </Form.Item> */}

        {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '100px' }}> */}
        <Form.Item name="profit_from" label="Từ: " rules={[{ required: true, message: 'Không được bỏ trống!' }]}>
          <InputNumber style={{ width: '100%' }} min={0} />
        </Form.Item>
        <Form.Item name="profit_to" label="Đến:" rules={[{ required: true, message: 'Không được bỏ trống!' }]}>
          <InputNumber style={{ width: '100%' }} min={0} />
        </Form.Item>
        {/* </div> */}
        {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '100px' }}> */}
        <Form.Item
          name="fila_commission_rate"
          label="LN Fila hưởng"
          rules={[{ required: true, message: 'Không được bỏ trống!' }]}
        >
          <InputNumber style={{ width: '100%' }} min={0} />
        </Form.Item>
        <Form.Item
          name="director_commission_rate"
          label="Giám đốc"
          rules={[{ required: true, message: 'Không được bỏ trống!' }]}
        >
          <InputNumber style={{ width: '100%' }} min={0} />
        </Form.Item>
        {/* </div> */}
        {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '100px' }}> */}
        <Form.Item
          name="manager_commision_rate"
          label="Trưởng phòng"
          rules={[{ required: true, message: 'Không được bỏ trống!' }]}
        >
          <InputNumber style={{ width: '100%' }} min={0} />
        </Form.Item>
        <Form.Item
          name="sale_commission_rate"
          label="Sale"
          rules={[{ required: true, message: 'Không được bỏ trống!' }]}
        >
          <InputNumber style={{ width: '100%' }} min={0} />
        </Form.Item>
        {/* </div> */}
        <Form.Item style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
          <Button type="primary" htmlType="submit">
            Tạo
          </Button>
        </Form.Item>
      </Form>
    </Fragment>
  );
};

export default CreateInterest;
