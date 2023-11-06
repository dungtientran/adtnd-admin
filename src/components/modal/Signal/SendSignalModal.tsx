/* eslint-disable @typescript-eslint/no-unused-vars */
import type { IlistStock } from '@/interface/stock/stock.interface';

import './index.less';

import {
  Alert,
  AutoComplete,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Radio,
  Row,
  Select,
  Typography,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { getGroupList } from '@/api/group';
import { searchStock } from '@/api/stock.api';
import { listCustomerApi } from '@/api/ttd_list_customer';
import { adminGetUser } from '@/api/user.api';

const { getListUser } = listCustomerApi;

interface SendSignalModalProps {
  open?: boolean;
  handleOk: (value: any) => any;
  confirmLoading?: boolean;
  handleCancel?: () => void;
}

function SendSignalModal({ open, handleOk, handleCancel, confirmLoading }: SendSignalModalProps) {
  const subscriptions = useSelector(state => state.subsciptions.subscriptions);
  const [targetSubscriptions, setTargetSubscriptions] = useState<any>([]);
  const [groups, setGroups] = useState<any>([]);
  const [targetGroup, setTargetGroup] = useState<any>([]);
  const [targetUser, setTargetUser] = useState<any>([]);
  const [step, setStep] = useState(0);
  const [form] = Form.useForm();
  const [stockList, setStockList] = useState<IlistStock[]>([]);
  const [user, setUser] = useState<any>(null);
  const [listUser, setListUser] = useState<{ label: string; value: string }[]>([]);
  const [listUserId, setListUserId] = useState<any>([]);
  const [sendAll, setSendAll] = useState(false);

  const handleSearchStock = async (query: string) => {
    searchStock(query).then((res: any) => {
      setStockList(res);
    });
  };

  const resetUser = () => {
    setUser(null);

    if (form.getFieldValue('email') !== '') {
      form.setFields([
        {
          name: 'customer_id',
          value: null,
        },
      ]);
    }
  };

  const fetchUser = useCallback(
    (email: string) => {
      adminGetUser(email)
        .then((res: any) => {
          console.log('user________________________________', res);

          if (res?.customer) {
            setUser(res.customer);
            form.setFieldValue('customer_id', res.customer.id);
          } else {
            resetUser();
          }
        })
        .catch(error => {
          console.log('error', error);
          resetUser();
        });
    },
    [user],
  );

  const fetchGroups = () => {
    getGroupList({
      current: 1,
      pageSize: 1000,
    }).then((res: any) => {
      console.log(res);
      setGroups(res.data);
    });
  };

  const fetchListUser = async () => {
    try {
      const listUserResponse = await getListUser('');

      const newListUser = listUserResponse?.map((user: any) => {
        return {
          label: user?.email,
          value: user?.id,
        };
      });

      // console.log('listUserResponse_________________', newListUser);
      setListUser(newListUser);
      // console.log('listUserResponse______________________', listUserResponse);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormSubmit = async (value: any) => {
    if (!value.subscription_product_id && !value.customer_id && !value.group_id && sendAll == false) {
      console.log(targetSubscriptions, targetGroup);

      return notification.error({
        message: 'Khuyến nghị phải được gửi đến ít nhất 1 trong 3 loại khách hàng trên',
      });
    } else {
      // console.log("value__________________________", value);
      handleOk({
        ...value,
        is_send_all: sendAll,
      });
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchListUser();
  }, []);

  return (
    <Modal
      title="Duyệt khuyến nghị"
      open={open}
      onOk={() => form.submit()}
      okText={'Gửi'}
      cancelText={'Hủy'}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
    >
      <div className="form_send_signal">
        <Form onFinish={handleFormSubmit} form={form}>
          <Typography.Title style={{ marginBottom: 20 }}>Gửi khuyến nghị này đến</Typography.Title>
          <Form.Item label={'Gửi đến tất cả'} name="is_send_all">
            <Checkbox name="is_send_all" defaultChecked={sendAll} onChange={e => setSendAll(e.target.checked)} />
          </Form.Item>
          <Form.Item name={subscriptions.length > 0 ? 'subscription_product_id' : ''} label={`Gói dịch vụ`}>
            <Select
              showSearch
              placeholder={'Chọn gói dịch vụ'}
              mode="multiple"
              // defaultValue={targetSubscriptions}
              optionFilterProp="children"
              onChange={value => setTargetSubscriptions(value)}
              filterOption={(input: string, option?: { label: string; value: string }) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={[...subscriptions?.map(item => ({ label: item.name, value: item.id }))]}
            />
          </Form.Item>
          <Form.Item name={groups.length > 0 ? 'group_id' : ''} label={`Nhóm khách hàng`}>
            <Select
              showSearch
              mode="multiple"
              placeholder={'Chọn nhóm khách hàng'}
              options={[
                ...groups?.map((item: any) => ({ label: item.name, value: item.id })),
                { label: 'None', value: null },
              ]}
              onChange={value => setTargetGroup(value)}
              filterOption={(input: string, option?: { label: string; value: string }) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
          <Form.Item label={'Khách hàng'} name="customer_id">
            {/* <Input
              placeholder={'Nhập email người dùng cần gửi'}
              onChange={async e => {
                const value = e.target.value;

                if (value) fetchUser(value);
                else form.setFieldValue('customer_id', null);
              }}
            /> */}
            <Select
              showSearch
              mode="multiple"
              placeholder="Chọn email người dùng cần gửi"
              optionFilterProp="children"
              onChange={value => setTargetUser(value)}
              filterOption={(input: string, option?: { label: string; value: string }) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={listUser}
            />
          </Form.Item>
          <Form.Item name="customer_id" hidden></Form.Item>
          {/* {user && (
            <Alert style={{ width: 180, marginBottom: 10 }} message={'Tài khoản hợp lệ'} type="success" showIcon />
          )} */}
        </Form>
      </div>
    </Modal>
  );
}

export default SendSignalModal;
