/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AutoComplete, Button, Form, Input, InputNumber, Select, Space, Typography } from 'antd';
import { Fragment, useEffect, useState } from 'react';

import { listCustomerApi } from '@/api/ttd_list_customer';

const { Title } = Typography;
const { getSaleList, getListUser } = listCustomerApi;
const { Option } = Select;

interface ICreateUser {
  setCustomerForm: (newCustomer: any) => void;
  initForm?: any;
  // setSaleCustomer: (sale: any) => void;
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

const EditUserManagement: React.FC<ICreateUser> = ({ setCustomerForm, initForm }) => {
  const [option, setOption] = useState<{ id: string; value: string; email: string; customer_code: string }[]>([]);
  const [option2, setOption2] = useState([
    {
      id: 'admin',
      value: 'Quản Trị',
    },
    {
      id: 'sale',
      value: 'Sale',
    },
    {
      id: 'analytics',
      value: 'Nhân viên Phân tích',
    },
    {
      id: 'business',
      value: 'Nhân viên nghiệp vụ',
    },
  ]);

  const userData = useQuery({
    queryKey: ['getListUser'],
    queryFn: () => getListUser(''),
  });

  useEffect(() => {
    if (userData.data) {
      const newOption2 = userData.data?.map((item: any) => ({
        value: item?.fullname,
        id: item?.id,
        email: item?.email,
        customer_code: item?.customer_code,
      }));

      setOption(newOption2);
    }
  }, [userData.data]);
  // const { data, isLoading, isError } = useQuery({
  //   queryKey: ['getSaleList'],
  //   queryFn: () => getSaleList(),
  // });

  // useEffect(() => {
  //   if (data) {
  //     const newOption = data?.data?.rows.map((item: any) => ({ value: item?.email, id: item?.id }));

  //     console.log('newOption__________', newOption);
  //     setOption(newOption);
  //   }
  // }, [data]);

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
    const newCustomer = {
      ...values,
      phone_number: `+84${values?.phone_number}`,
    };

    console.log('Received values of form: ', values);
    const sale_id = option2.find(item => item.value === values.role_id)?.id;

    // console.log('sale_id_______________', sale_id);
    // setCustomerForm(newCustomer);
  };

  console.log('init__________', initForm);

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
          name="fullname"
          label="Họ tên"
          rules={[{ required: true, message: 'Vui lòng nhập họ tên!', whitespace: true }]}
        >
          <Input placeholder="Họ tên" />
        </Form.Item> */}
        <Form.Item
          name="fullname"
          label="Tên khách hàng"
          rules={[{ required: true, message: 'Không đc bỏ trống !', whitespace: true }]}
        >
          <AutoComplete
            style={{ width: '100%' }}
            options={option}
            placeholder="Nhập email nhân viên hỗ trợ"
            filterOption={(inputValue, option) => option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
            size="large"
            // onChange={value => setNameSelect(value)}
            disabled={initForm}
          />
        </Form.Item>

        <Form.Item
          name="role_id"
          label="Chức vụ"
          rules={[{ required: true, message: 'Vui lòng nhập chức vụ !', whitespace: true }]}
        >
          <AutoComplete
            style={{ width: '100%' }}
            options={option2}
            placeholder="Chức vụ"
            filterOption={(inputValue, option) => option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
            size="large"
            disabled={initForm}
          />
        </Form.Item>
        <Form.Item name="level" label="Level">
          <InputNumber defaultValue={1} min={1} />
        </Form.Item>

        {!initForm && (
          <Fragment>
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
              <Input.Password placeholder="Mật khẩu" />
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
              <Input.Password placeholder="Nhập lại mật khẩu" />
            </Form.Item>
          </Fragment>
        )}

        <Form.Item style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '' }}>
          <Button type="primary" htmlType="submit">
            {initForm ? 'Lưu' : 'Tạo mới'}
          </Button>
        </Form.Item>
      </Form>
    </Fragment>
  );
};

export default EditUserManagement;
