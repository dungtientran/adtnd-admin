/* eslint-disable @typescript-eslint/no-unused-vars */
import './index.less';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AutoComplete, Button, Form, Input, Select, Space, Typography } from 'antd';
import { Fragment, useEffect, useState } from 'react';

import { listCustomerApi } from '@/api/ttd_list_customer';

const { Title } = Typography;
const { getSaleList } = listCustomerApi;
const { Option } = Select;

interface ICreateUser {
  setCustomerForm: (newCustomer: any) => void;
  initForm?: any;
  setSaleCustomer: (sale: any) => void;
}

const passwordValidator = (value: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.\[\]{}\(\)?\-"!@#%&/,><\':;|_~`])\S{7,99}$/;

  if (value.match(passwordRegex)) {
    return true;
  }

  return false;
};

const prefixSelector = (
  <Form.Item noStyle>
    <Select style={{ width: 70 }} defaultValue="84">
      <Option value="84">+84</Option>
    </Select>
  </Form.Item>
);

const CreateUser: React.FC<ICreateUser> = ({ setCustomerForm, initForm, setSaleCustomer }) => {
  const [isDisable, setIsisDisable] = useState(false);
  const [option, setOption] = useState<{ id: string; value: string }[]>([]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getSaleList'],
    queryFn: () => getSaleList(),
  });

  useEffect(() => {
    if (data) {
      const newOption = data?.data?.rows.map((item: any) => ({ value: item?.email, id: item?.id }));

      console.log('newOption__________', newOption);
      setOption(newOption);
    }
  }, [data]);
  useEffect(() => {
    if (initForm) {
      setIsisDisable(true);
      form.setFieldsValue(initForm);
    } else {
      form.resetFields();
      setIsisDisable(false);
    }
  }, [initForm]);
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    const newCustomer = {
      ...values,
      phone_number: `+84${values?.phone_number}`,
    };

    // console.log('Received values of form: ', newCustomer);

    setCustomerForm(newCustomer);
  };

  const handleAddSale = (values: any) => {
    // console.log('sale__________', values);
    const sale_id = option.find(item => item.value === values.sale)?.id;

    setSaleCustomer({
      customer_id: initForm?.id,
      sale_id,
    });
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
        disabled={isDisable}
        className="form_add_user"
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

        <Form.Item
          name="phone_number"
          label="SĐT"
          rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
        >
          <Input addonBefore={prefixSelector} style={{ width: '100%' }} type="number" />
        </Form.Item>

        {!isDisable && (
          <Fragment>
            <Form.Item name="code" label="Mã giới thiệu">
              <Input />
            </Form.Item>
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập Mật khẩu!',
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
                  message: 'Vui lòng nhập lại mật khẩu!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }

                    return Promise.reject(new Error('Mật khẩu không trùng!'));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '' }}>
              <Button type="primary" htmlType="submit">
                Tạo mới
              </Button>
            </Form.Item>
          </Fragment>
        )}
      </Form>
      {isDisable && (
        <Form layout="vertical" onFinish={handleAddSale}>
          <Form.Item
            name="sale"
            label="Nhân viên"
            rules={[{ required: true, message: 'Vui lòng nhập email nhân viên!', whitespace: true }]}
          >
            <AutoComplete
              style={{ width: '100%' }}
              options={option}
              placeholder="Nhập email nhân viên hỗ trợ"
              filterOption={(inputValue, option) =>
                option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
              size="large"
            />
          </Form.Item>
          <Form.Item style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '' }}>
            <Button type="primary" htmlType="submit">
              Thêm
            </Button>
          </Form.Item>
        </Form>
      )}
    </Fragment>
  );
};

export default CreateUser;
