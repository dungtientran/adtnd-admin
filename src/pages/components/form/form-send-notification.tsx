/* eslint-disable @typescript-eslint/no-unused-vars */
import type { UseMutationResult } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';
import { AutoComplete, Button, Checkbox, Form, Input, InputNumber, Select, Space, Spin, Typography } from 'antd';
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
  const [listCustomerId, setListCustomerId] = useState<any>([]);
  const [listGroupId, setListGroupId] = useState<any>([]);

  const [option, setOption] = useState<{ label: string; value: string }[]>([]);
  const [option2, setOption2] = useState<{ label: string; value: string }[]>([]);

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
        label: item?.email,
        value: item?.id,
        name: item?.fullname,
        email: item?.email,
        customer_code: item?.customer_code,
        phone_number: item?.phone_number,
      }));

      setOption(newOption2);
    }

    if (groupData.data) {
      const newOption = groupData.data?.map((item: any) => ({
        value: item?.id,
        label: item?.name,
      }));

      setOption2(newOption);
    }
  }, [userData.data, groupData.data]);

  const onFinish = (values: any) => {
    console.log('values_____________________', values);
    // const customer_id = option.find(item => item.email === values?.email)?.id;
    const notification_id = idNotification;
    const newValues = {
      // customer_id: listCustomerId,
      notification_id,
      ...values,
    };

    sendNotificationHandle.mutate(newValues);
    // console.log('new_________________________', newValues);
  };

  // console.log('gorup__________________', groupData.data);
  // console.log('id__________________', idNotification);
  // console.log('userData.data____________________________', groupData.data);

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
          // rules={[{ required: true, message: 'Không được bỏ trống!' }]}
        >
          <Checkbox />
        </Form.Item>
        <Form.Item
          name="customer_id"
          label="Chọn email khách hàng"
          // rules={[{ required: true, message: 'Không đc bỏ trống !', whitespace: true }]}
        >
          {/* <AutoComplete
            style={{ width: '100%' }}
            options={option}
            placeholder="Chọn email khách hàng"
            filterOption={(inputValue, option) => option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
            size="large"
            // onChange={value => setsaleSelect(value)}
            // disabled={initForm}
          /> */}
          <Select
            placeholder="Chọn email khách hàng"
            mode="multiple"
            defaultValue={listCustomerId}
            onChange={value => setListCustomerId(value)}
            filterOption={(input: string, option?: { label: string; value: string }) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            // options={[...option?.map(item => ({ label: item.name, value: item.id }))]}
            options={option}
          />
        </Form.Item>

        <Form.Item
          name="group_id"
          label="Group"
          // rules={[{ required: true, message: 'Vui lòng nhập chức vụ !', whitespace: true }]}
        >
          {/* <AutoComplete
            style={{ width: '100%' }}
            options={option2}
            placeholder="Nhập tên group"
            filterOption={(inputValue, option) => option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
            size="large"
            // disabled={initForm}
          /> */}
          <Select
            placeholder="Nhập tên group"
            mode="multiple"
            defaultValue={listGroupId}
            onChange={value => setListGroupId(value)}
            // options={[...option2?.map(item => ({ label: item.value, value: item.id }))]}
            options={option2}
            filterOption={(input: string, option?: { label: string; value: string }) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
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
