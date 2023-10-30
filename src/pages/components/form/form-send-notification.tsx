/* eslint-disable @typescript-eslint/no-unused-vars */
import type { UseMutationResult } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';
import { AutoComplete, Button, Checkbox, Form, Input, InputNumber, Select, Space, Spin, Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { Fragment, useEffect, useState } from 'react';

import { listCustomerApi } from '@/api/ttd_list_customer';

const { Option } = Select;

const { getListUser, getListGroup } = listCustomerApi;

interface ICreateUser {
  idNotification?: string;
  useSale: () => {
    sendNotificationHandle: UseMutationResult<any, any, any, unknown>;
  };
}

const SendNotification: React.FC<ICreateUser> = ({ idNotification, useSale }) => {
  const { sendNotificationHandle } = useSale();
  const [form] = Form.useForm();

  const [option, setOption] = useState<
    { id: string; value: string; name: string; customer_code: string; email: string; phone_number: string }[]
  >([]);
  const [option2, setOption2] = useState<{ id: string; value: string }[]>([]);

  const userData = useQuery({
    queryKey: ['getListUser'],
    queryFn: () => getListUser(''),
  });
  const groupData = useQuery({
    queryKey: ['getListGroup'],
    queryFn: () => getListGroup(''),
  });

  useEffect(() => {
    if (userData.data) {
      const newOption2 = userData.data?.map((item: any) => ({
        value: item?.email,
        id: item?.id,
        name: item?.fullname,
        email: item?.email,
        customer_code: item?.customer_code,
        phone_number: item?.phone_number,
      }));

      setOption(newOption2);
    }

    if (groupData.data) {
      const newOption = groupData.data?.map((item: any) => ({
        value: item?.name,
        id: item?.id,
        name: item?.name,
      }));

      setOption2(newOption);
    }
  }, [userData.data, groupData.data]);

  const onFinish = (values: any) => {
    // console.log('values_____________________', values);
    const customer_id = option.find(item => item.email === values?.email)?.id;
    const notification_id = idNotification;
    const newValues = {
      customer_id,
      notification_id,
      ...values,
    };

    sendNotificationHandle.mutate(newValues);
    // console.log('new_________________________', newValues);
  };

  // console.log('gorup__________________', groupData.data);
  // console.log('id__________________', idNotification);

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
        <Form.Item
          name="send_all"
          label="Gửi đến tất cả:"
          valuePropName="checked"
          rules={[{ required: true, message: 'Không được bỏ trống!' }]}
        >
          <Checkbox />
        </Form.Item>
        <Form.Item
          name="email"
          label="Chọn email khách hàng"
          // rules={[{ required: true, message: 'Không đc bỏ trống !', whitespace: true }]}
        >
          <AutoComplete
            style={{ width: '100%' }}
            options={option}
            placeholder="Chọn email khách hàng"
            filterOption={(inputValue, option) => option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
            size="large"
            // onChange={value => setsaleSelect(value)}
            // disabled={initForm}
          />
        </Form.Item>

        <Form.Item
          name="group_id"
          label="Group"
          // rules={[{ required: true, message: 'Vui lòng nhập chức vụ !', whitespace: true }]}
        >
          <AutoComplete
            style={{ width: '100%' }}
            options={option2}
            placeholder="Nhập tên group"
            filterOption={(inputValue, option) => option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
            size="large"
            // disabled={initForm}
          />
        </Form.Item>

        <Form.Item style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '' }}>
          <Spin spinning={sendNotificationHandle.isLoading}>
          <Button type="primary" htmlType="submit">
            Gửi
          </Button>
          </Spin>
        </Form.Item>
      </Form>
    </Fragment>
  );
};

export default SendNotification;
