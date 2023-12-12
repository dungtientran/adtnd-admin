/* eslint-disable @typescript-eslint/no-unused-vars */
import type { UseMutationResult } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';
import { AutoComplete, Button, Form, Input, InputNumber, Select, Space, Spin, Typography } from 'antd';
import { Fragment, useEffect, useState } from 'react';

import { listCustomerApi } from '@/api/ttd_list_customer';
import { salePosition } from '@/pages/UserManagement/UserManagement/UserManagement';

const { getListUser } = listCustomerApi;

interface ICreateUser {
  initForm?: any;
  useSale: () => {
    create: UseMutationResult<any, any, any, unknown>;
    update: UseMutationResult<any, any, any, unknown>;
  };
}

const passwordValidator = (value: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.\[\]{}\(\)?\-"!@#%&/,><\':;|_~`])\S{7,99}$/;

  if (value.match(passwordRegex)) {
    return true;
  }

  return false;
};

const EditUserManagement: React.FC<ICreateUser> = ({ initForm, useSale }) => {
  const [option, setOption] = useState<
    { id: string; value: string; name: string; customer_code: string; email: string; phone_number: string }[]
  >([]);
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

  const [optionSalePosition, setOptionSalePosition] = useState([
    {
      id: 1,
      value: 'Trưởng phòng',
    },
    {
      id: 2,
      value: 'Giám đốc kinh doanh',
    },
    {
      id: 3,
      value: 'Giám đốc Khối',
    },
  ]);
  const [saleSelect, setsaleSelect] = useState('');

  const [salePositionSelect, setSalePosition] = useState('');

  const userData = useQuery({
    queryKey: ['getListUser'],
    queryFn: () => getListUser(''),
  });

  const { create, update } = useSale();

  useEffect(() => {
    if (userData.data) {
      const newOption2 = userData.data?.map((item: any) => ({
        value: item?.customer_code,
        id: item?.id,
        name: item?.fullname,
        email: item?.email,
        customer_code: item?.customer_code,
        phone_number: item?.phone_number,
      }));

      setOption(newOption2);
    }
  }, [userData.data]);

  useEffect(() => {
    if (initForm) {
      const newInit = {
        ...initForm,
        role_id: initForm?.role?.name,
        level: salePosition[Number(initForm?.SaleLevel?.level) - 1],
      };

      setSalePosition(initForm?.role?.name);
      form.setFieldsValue(newInit);
    } else {
      form.resetFields();
    }
  }, [initForm]);

  useEffect(() => {
    if (saleSelect) {
      const sale_id_select = option.find(item => item.value === saleSelect)?.name;

      form.setFieldsValue({
        fullname: sale_id_select,
      });
    }
  }, [saleSelect]);

  const [form] = Form.useForm();

  const handleCreateSale = (newSale: any) => {
    create.mutate(newSale);
  };

  const handleUpDateSale = (updateSale: any) => {
    update.mutate(updateSale);
  };

  const onFinish = (values: any) => {
    const id = option.find(item => item.value === saleSelect)?.id;
    const email = option.find(item => item.value === saleSelect)?.email;
    const fullname = option.find(item => item.value === saleSelect)?.name;
    const phone_number = option.find(item => item.value === saleSelect)?.phone_number;
    const sale_id = option2.find(item => item.value === values.role_id)?.id;
    const level = optionSalePosition.find(item => item.value === values.level)?.id;
    console.log('level: ' + level)
    const new_Sale = {
      role_id: sale_id,
      password: values?.password,
      level,
      customer: {
        id,
        email,
        fullname,
        phone_number,
      },
    };
    const updateSale = {
      // admin_id: initForm?.id,
      sale_id: initForm?.id,
      level: level || 0,
      role_id: sale_id,
    };

    if (!initForm) {
      handleCreateSale(new_Sale);
    } else {
      handleUpDateSale(updateSale);
    }
  };

  console.log('init_________________', initForm);

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
        {!initForm ? (
          <Form.Item
            name="sale_id"
            label="Mã khách hàng"
            rules={[{ required: true, message: 'Không đc bỏ trống !', whitespace: true }]}
          >
            <AutoComplete
              style={{ width: '100%' }}
              options={option}
              placeholder="Nhập mã khách hàng"
              filterOption={(inputValue, option) =>
                option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
              size="large"
              onChange={value => setsaleSelect(value)}
              disabled={initForm}
            />
          </Form.Item>
        ) : (
          <Form.Item
            name="staff_code"
            label="Mã nhân viên"
            // rules={[{ required: true, message: 'Không đc bỏ trống !', whitespace: true }]}
          >
            <Input disabled />
          </Form.Item>
        )}

        <Form.Item name="fullname" label="Tên khách hàng">
          <Input disabled />
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
            onChange={value => {
              setSalePosition(value)
            }}
          />
        </Form.Item>
        {salePositionSelect === 'Sale' && (
          <Form.Item name="level" label="Level">
            {/* <InputNumber defaultValue={1} min={1} max={4} /> */}
            <AutoComplete
              style={{ width: '100%' }}
              options={optionSalePosition}
              placeholder="Level"
              filterOption={(inputValue, option) =>
                option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              }
              size="large"
            />
          </Form.Item>
        )}

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

export default EditUserManagement;
