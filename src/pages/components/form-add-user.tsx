import { Button, Form, Input, Select } from 'antd';

const { Option } = Select;

interface ICreateUser {
  setCustomerForm: (newCustomer: any) => void;
}

const CreateUser:React.FC<ICreateUser> = ({setCustomerForm}) => {
  const [form] = Form.useForm();

  const passwordValidator = (value: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.\[\]{}\(\)?\-"!@#%&/,><\':;|_~`])\S{7,99}$/;

    if (value.match(passwordRegex)) {
      return true;
    }

    return false;
  };

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
    setCustomerForm(values)
  };

  const prefixSelector = (
    <Form.Item noStyle>
      <Select style={{ width: 70 }} defaultValue="84">
        <Option value="84">+84</Option>
      </Select>
    </Form.Item>
  );

  return (
    <Form
      //   {...formItemLayout}
      form={form}
      name="register"
      layout="vertical"
      autoComplete="off"
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
      scrollToFirstError
    >
      <Form.Item
        name="fullname"
        label="Họ tên"
        rules={[{ required: true, message: 'Vui lòng nhập họ tên!', whitespace: true }]}
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

      <Form.Item name="phone_number" label="SĐT" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
        <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="password"
        label="Mật khẩu"
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập Mật khẩu!',
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Nhập lại mật khẩu"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập lại Mật khẩu!',
          },
          {
            validator(_, value) {
              if (!value || passwordValidator(value)) {
                return Promise.resolve();
              }

              return Promise.reject(
                new Error(
                  'Mật khẩu tối thiểu 8 ký tự và phải có ít nhất 1 chữ số, 1 chữ cái in hoa và 1 kí tự đặc biệt',
                ),
              );
            },
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '' }}>
        <Button type="primary" htmlType="submit">
          Tạo mới
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateUser;
