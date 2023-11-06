import type { IlistStock } from '@/interface/stock/stock.interface';

import {
  AutoComplete,
  Button,
  Checkbox,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Space,
  Spin,
  Typography,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { error } from 'console';
import { setPriority } from 'os';
import React, { useEffect, useState } from 'react';

import { createSignal } from '@/api/signal';
import { searchStock } from '@/api/stock.api';
import { useStates } from '@/utils/use-states';

const { Option } = Select;

interface UpdateSingalDrawerProps {
  onClose: () => void;
  onSubmit: (value: any) => any;
  open: boolean;
  data: any;
  spining: boolean;
}

function UpdateSingalDrawer({ open, onClose, onSubmit, data, spining }: UpdateSingalDrawerProps) {
  const [form] = Form.useForm();

  const [stockId, setStockId] = useState<any>('');
  const [priority, setPriority] = useState<boolean>(false);
  const [stockList, setStockList] = useState<IlistStock[]>([]);

  const handleSearchStock = async (query: string) => {
    searchStock(query).then((res: any) => {
      setStockList(res);
    });
  };

  const handleSubmit = async (value: any) => {
    // console.log('form value: ', value);
    // console.log('stock_id: ', stockId);
    await onSubmit({
      ...value,
      stock_id: stockId,
      priority: priority,
    });
  };

  useEffect(() => {
    if (data) {
      const newData = {
        ...data,
        is_long_term: data?.is_long_term === 'Ngắn hạn' ? false : true,
      };

      form.setFieldsValue(newData);
      handleSearchStock(data.code);
      setPriority(data.priority);
    }
  }, [data]);
  //   console.log('data____________________update', data);

  return (
    <Drawer
      title="Cập nhật "
      width={420}
      onClose={onClose}
      open={open}
      bodyStyle={{ paddingBottom: 80 }}
      extra={
        <Space>
          <Button onClick={onClose}>
            <Typography>Hủy</Typography>
          </Button>
          <Button onClick={() => form.submit()} type="primary">
            <Typography>Cập nhật</Typography>
          </Button>
        </Space>
      }
    >
      <Form onFinish={handleSubmit} form={form} layout="vertical">
        <Spin spinning={spining}>
          <div>
            <Form.Item name="is_long_term" initialValue={false}>
              <Radio.Group defaultValue={false}>
                <Radio.Button value={false}>Ngắn hạn</Radio.Button>
                <Radio.Button value={true}>Dài hạn</Radio.Button>
              </Radio.Group>
            </Form.Item>
            {data?.is_closed && (
              <Form.Item label={'Ưu tiên hiển thị trước'} name="is_send_all">
                <Checkbox name="is_send_all" checked={priority} onChange={e => setPriority(e.target.checked)} />
              </Form.Item>
            )}
            <Typography className="mb-[5px]">Mã chứng khoán</Typography>
            <Form.Item
              name="code"
              hasFeedback
              rules={[
                { required: true, message: 'Vui lòng chọn mã chứng khoán' },
                {
                  validator(_, value: string) {
                    const index = stockList.findIndex(item => value === item.code);

                    if (index > -1) {
                      form.setFieldValue('stock_id', stockList[index].id);
                      setStockId(stockList[index]?.id);

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
            <Form.Item name="description" label="Mô tả">
              <TextArea autoSize placeholder={'Mô tả'}></TextArea>
            </Form.Item>

            <Form.Item
              label="Giá mua"
              name="target_buy_price"
              rules={[{ required: true, message: 'Vui lòng điền vào trường này' }]}
            >
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item
              label="Giá cắt lỗ"
              name="target_stop_loss"
              rules={[
                { required: true, message: 'Vui lòng điền vào trường này' },
                {
                  validator(_, value: string) {
                    const buy_price = form.getFieldValue('target_buy_price');

                    if (buy_price >= value) {
                      return Promise.resolve();
                    }

                    return Promise.reject(new Error('Giá cắt lỗ phải bé hơn giá mua'));
                  },
                },
              ]}
            >
              <InputNumber min={0} />
            </Form.Item>

            <Form.Item
              label="Giá chốt lời 1"
              name="target_sell_price_1"
              rules={[
                { required: true, message: 'Vui lòng điền vào trường này' },
                {
                  validator(_, value: number) {
                    const buy_price = form.getFieldValue('target_buy_price');

                    if (buy_price <= value) {
                      return Promise.resolve();
                    }

                    return Promise.reject(new Error('Giá chốt lời 1 phải lớn hơn giá mua'));
                  },
                },
              ]}
            >
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item
              label="Giá chốt lời 2"
              name="target_sell_price_2"
              rules={[
                { required: true, message: 'Vui lòng điền vào trường này' },
                {
                  validator(_, value: number) {
                    const sell_1 = form.getFieldValue('target_sell_price_1');

                    if (sell_1 <= value) {
                      return Promise.resolve();
                    }

                    return Promise.reject(new Error('Giá chốt lời 2 phải lớn hơn chốt lời 1'));
                  },
                },
              ]}
            >
              <InputNumber min={0} />
            </Form.Item>

            <Form.Item
              label="Giá chốt lời 3"
              name="target_sell_price_3"
              rules={[
                { required: true, message: 'Vui lòng điền vào trường này' },
                {
                  validator(_, value: number) {
                    const sell_2 = form.getFieldValue('target_sell_price_2');

                    if (sell_2 <= value) {
                      return Promise.resolve();
                    }

                    return Promise.reject(new Error('Giá chốt lời 3 phải lớn hơn chốt lời 2'));
                  },
                },
              ]}
            >
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item name="note" label="Ghi chú">
              <TextArea autoSize placeholder={'Ghi chú'}></TextArea>
            </Form.Item>
          </div>
        </Spin>
      </Form>
    </Drawer>
  );
}

export default UpdateSingalDrawer;
