/* eslint-disable @typescript-eslint/no-unused-vars */
import type { UseMutationResult } from '@tanstack/react-query';
import type { DatePickerProps } from 'antd';

import './index.less';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AutoComplete, Button, DatePicker, Form, Input, Select, Space, Spin, Typography } from 'antd';
import moment from 'moment';
import { Fragment, useEffect, useState } from 'react';

import { listCustomerApi } from '@/api/ttd_list_customer';

const { Title } = Typography;
const { getSaleList } = listCustomerApi;
const { Option } = Select;

interface ICreateUser {
  initForm?: any;
  setSaleCustomer: (sale: any) => void;
  useCustomer: () => {
    create: UseMutationResult<any, unknown, any, unknown>;
    update: UseMutationResult<any, unknown, any, unknown>;
    subscriptionChage: UseMutationResult<any, unknown, any, unknown>;
  };
}
const currentDate = new Date();

const ChangeSubscription: React.FC<ICreateUser> = ({ initForm, setSaleCustomer, useCustomer }) => {
  const [endDate, setEndDate] = useState('');
  const [option, setOption] = useState([
    {
      id: 'trial',
      value: 'Trial',
    },
    {
      id: 'vip',
      value: 'VIP',
    },
    {
      id: 'premium',
      value: 'Premium',
    },
  ]);
  const { create, update, subscriptionChage } = useCustomer();

  const disabledDate = (current: any) => {
    return current && current < currentDate;
  };

  const handleUpdate = (newData: any) => {
    create.mutate(newData);
  };

  useEffect(() => {
    if (initForm) {
      // const newOptions = option.filter(item => item?.value !== initForm?.subscription_product);

      // console.log('newOptions_____________________________', newOptions);
      // setOption(newOptions);
      form.setFieldsValue({
        ...initForm,
        phone_number: Number(initForm?.phone_number),
      });
    } else {
      form.resetFields();
    }
  }, [initForm]);
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    const subscription_product_id = option.find(item => item.value === values?.subscription_product_id)?.id;

    const newCustomer = {
      customer_id: initForm?.id,
      subscription_product_id,
      end_date: moment(endDate).format('MM-DD-YYYY'),
    };

    console.log('subscription_product_id_________________', subscription_product_id);
    // handleUpdate(newCustomer);
    subscriptionChage.mutate(newCustomer);
  };

  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    setEndDate(dateString as string);
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
        className="form_add_user"
      >
        <Form.Item name="subscription_product" label="Gói dịch vụ hiện tại">
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="subscription_product_id"
          label="Gói dịch vụ thay đổi"
          rules={[
            {
              required: true,
              message: 'Không được bỏ trống!',
            },
          ]}
        >
          <AutoComplete
            style={{ width: '100%' }}
            options={option}
            placeholder="Nhập gói dịch vụ"
            filterOption={(inputValue, option) => option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="end_date"
          label="Ngày kết thúc"
          rules={[
            {
              required: true,
              message: 'Không được bỏ trống!',
            },
          ]}
        >
          <DatePicker onChange={onChange} disabledDate={disabledDate} />
        </Form.Item>

        <Form.Item style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '' }}>
          <Spin spinning={subscriptionChage.isLoading}>
            <Button type="primary" htmlType="submit">
              Thay đổi
            </Button>
          </Spin>
        </Form.Item>
      </Form>
    </Fragment>
  );
};

export default ChangeSubscription;
