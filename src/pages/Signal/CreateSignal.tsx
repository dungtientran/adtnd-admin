import type { IlistStock } from '@/interface/stock/stock.interface';

import './index.less';

import {
  Alert,
  AutoComplete,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { getGroupList } from '@/api/group';
import { axiosInstance } from '@/api/request';
import { searchStock } from '@/api/stock.api';

const { TextArea } = Input;

function CreateSignal() {
  const [step, setStep] = useState(0);
  const [form] = Form.useForm();
  const [sendAll, setSendAll] = useState(false);
  const subscriptions = useSelector(state => state.subsciptions.subscriptions);
  const [targetSubscriptions, setTargetSubscriptions] = useState<any>([]);
  const [priority, setPriority] = useState(false);
  const [targetGroup, setTargetGroup] = useState<any>([]);
  const [targetCustomer, setTargetCustomer] = useState<any>(null);
  const [stockList, setStockList] = useState<IlistStock[]>([]);
  const [groups, setGroups] = useState<any>([]);

  const [user, setUser] = useState<any>(null);

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

  const fetchUser = (email: string) => {
    console.log(email);
    axiosInstance
      .get(`/admin/customer/find/${email}`)
      .then(res => {
        if (res?.data?.customer) {
          setUser(res?.data?.customer);
          form.setFieldValue('customer_id', res?.data?.customer.id);
        } else {
          resetUser();
        }
      })
      .catch(() => {
        resetUser();
      });
  };

  const handleSearchStock = async (query: string) => {
    searchStock(query).then((res: any) => {
      setStockList(res);
    });
  };

  const fetchGroups = () => {
    getGroupList({
      current: 1,
      pageSize: 1000,
    }).then((res: any) => {
      console.log(res);
      setGroups(res.data);
    });
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div>
      <Typography.Title level={2} className="text-center">
        Tạo ý tưởng mới
      </Typography.Title>
      <div>
        <div className="w-[700px] max-w-[100%] mx-[auto]">
          <Form>
            <div>
              <Typography.Title level={3}>Thông tin khuyến nghị</Typography.Title>

              <Typography className="mb-[5px]">Mã chứng khoán</Typography>
              <Form.Item
                name="code"
                hasFeedback
                rules={[
                  { required: true, message: 'Please select an email' },
                  {
                    validator(_, value: string) {
                      console.log(stockList);
                      const index = stockList.findIndex(item => value === item.code);

                      if (index > -1) {
                        form.setFieldValue('stock_id', stockList[index].id);

                        return Promise.resolve();
                      }

                      return Promise.reject(new Error('Mã CK không hợp lệ!'));
                    },
                  },
                ]}
              >
                <AutoComplete
                  size="large"
                  options={stockList?.map(item => ({ value: item.code, key: item.id }))}
                  placeholder={'Nhập mã chứng khoán'}
                  filterOption={(inputValue, option: any) =>
                    option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                  }
                  onSearch={e => handleSearchStock(e)}
                />
              </Form.Item>
              <Form.Item name="description">
                <Typography className="mb-[5px]">Mô tả</Typography>
                <TextArea placeholder={'Mô tả'} style={{ height: 120 }} />
              </Form.Item>
              <Row>
                <Col xs={6} lg={6}>
                  <Typography className="mb-[5px]">Giá chốt lời 1</Typography>
                  <Form.Item
                    name="target_sell_price_1"
                    rules={[{ required: true, message: 'Vui lòng điền vào trường này' }]}
                  >
                    <InputNumber min={0} />
                  </Form.Item>
                </Col>
                <Col xs={6} lg={6}>
                  <Typography className="mb-[5px]">Giá chốt lời 2</Typography>
                  <Form.Item
                    name="target_sell_price_2"
                    rules={[{ required: true, message: 'Vui lòng điền vào trường này' }]}
                  >
                    <InputNumber min={0} />
                  </Form.Item>
                </Col>
                <Col xs={6} lg={6}>
                  <Typography className="mb-[5px]">Giá chốt lời 3</Typography>
                  <Form.Item
                    name="target_sell_price_3"
                    rules={[{ required: true, message: 'Vui lòng điền vào trường này' }]}
                  >
                    <InputNumber min={0} />
                  </Form.Item>
                </Col>
                <Col xs={6} lg={6}>
                  <Typography className="mb-[5px]">Giá cắt lỗ</Typography>
                  <Form.Item
                    name="target_stop_loss"
                    rules={[{ required: true, message: 'Vui lòng điền vào trường này' }]}
                  >
                    <InputNumber min={0} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="note">
                <Typography className="mb-[5px]">Ghi chú</Typography>

                <TextArea placeholder={'Ghi chú '} />
              </Form.Item>
              <Form.Item initialValue={false}>
                <Radio.Group>
                  <Radio.Button value={false}>Ngắn hạn</Radio.Button>
                  <Radio.Button value={true}>Dài hạn</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </div>
            <div>
              <Divider />
              <Typography.Title level={3}>Chỉ định đến khách hàng</Typography.Title>
              <div>
                <Form.Item label={'Gửi đến tất cả'} name="title">
                  <Checkbox name="is_send_all" defaultChecked={sendAll} onChange={e => setSendAll(e.target.checked)} />
                </Form.Item>
                <Form.Item
                  name={subscriptions.length > 0 ? 'subscription_product_id' : ''}
                  label={`Gói dịch vụ`}
                  initialValue={targetSubscriptions}
                >
                  <Select
                    placeholder={'Chọn gói dịch vụ'}
                    mode="multiple"
                    onChange={value => setTargetSubscriptions(value)}
                    options={[...subscriptions?.map(item => ({ label: item.name, value: item.id }))]}
                  />
                </Form.Item>
                <Form.Item
                  name={groups.length > 0 ? 'group_id' : ''}
                  label={`Nhóm khách hàng`}
                  initialValue={targetGroup}
                >
                  <Select
                    mode="multiple"
                    placeholder={'Chọn nhóm khách hàng'}
                    options={[
                      ...groups?.map((item: any) => ({ label: item.name, value: item.id })),
                      { label: 'None', value: null },
                    ]}
                    onChange={value => setTargetGroup(value)}
                  />
                </Form.Item>
                <Form.Item
                  label={'Khách hàng'}
                  name="email"
                  rules={[
                    {
                      type: 'email',
                      message: 'Email không hợp lệ',
                    },
                  ]}
                  initialValue={targetCustomer}
                >
                  <Input
                    placeholder={'Nhập email người dùng cần gửi'}
                    onChange={async e => {
                      const value = e.target.value;

                      if (value) fetchUser(value);
                      else form.setFieldValue('customer_id', null);
                    }}
                  />
                </Form.Item>
                <Form.Item name="customer_id" hidden></Form.Item>
                {user && (
                  <Alert
                    style={{ width: 180, marginBottom: 10 }}
                    message={'Tài khoản hợp lệ'}
                    type="success"
                    showIcon
                  />
                )}
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default CreateSignal;
