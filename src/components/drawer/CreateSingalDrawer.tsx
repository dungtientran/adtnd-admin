import type { IlistStock } from '@/interface/stock/stock.interface';

import { UploadOutlined } from '@ant-design/icons';
import {
  AutoComplete,
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Row,
  Select,
  Space,
  Spin,
  Typography,
  Upload,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { error } from 'console';
import React, { useEffect, useState } from 'react';

import { createSignal } from '@/api/signal';
import { searchStock } from '@/api/stock.api';
import { checkImageType } from '@/utils/checkImageType';
import { getUrlImageUpload } from '@/utils/getUrlImageUpload';

const { Option } = Select;

interface CreateSingalDrawerProps {
  onClose: () => void;
  onSubmit: (value: any) => any;
  open: boolean;
  spining: boolean;
}

function CreateSingalDrawer({ open, onClose, onSubmit, spining }: CreateSingalDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [stockId, setStockId] = useState<any>('');
  const [stockList, setStockList] = useState<IlistStock[]>([]);
  const [imageChartUrl, setImageChartUrl] = useState('');

  const handleSearchStock = async (query: string) => {
    searchStock(query).then((res: any) => {
      setStockList(res);
    });
  };

  const normFile = (e: any) => {
    if (checkImageType(e.file)) {
      if (Array.isArray(e)) {
        return e;
      }

      return e?.fileList;
    }
  };

  const handleSubmit = async (value: any) => {
    // if (loading) return;
    // setLoading(true);
    // // console.log('form value: ', value);
    // // console.log('stock_id: ', stockId);
    // const res = await onSubmit({
    //   ...value,
    //   stock_id: stockId,
    // });

    // if (res) {
    //   form.resetFields();
    // }

    // setLoading(false);

    // console.log('_______________value', value?.image_chart?.[0]?.originFileObj);
    // console.log('_______________files', files);
    if (loading) return;

    setLoading(true);

    try {
      const files = value?.image_chart?.[0]?.originFileObj;

      // eslint-disable-next-line newline-after-var, @typescript-eslint/no-unused-vars

      if (files) {
        const imageChartUrlResponse = await getUrlImageUpload('chartUpload', files, 'chart');

        console.log('imageChartUrlResponse______________________________', imageChartUrlResponse);

        if (imageChartUrlResponse) {
          setImageChartUrl(imageChartUrlResponse);
        } else {
          return setLoading(false);
        }
      }

      console.log('imageChartUrl_____________________________________', imageChartUrl);
      const res = await onSubmit({
        ...value,
        stock_id: stockId,
        detail_chart: imageChartUrl,
      });

      if (res) {
        form.resetFields();
      }

      setLoading(false);
    } catch (error) {
      console.log('errror)__________________________', error);
    }

    setLoading(false);
  };

  return (
    <Drawer
      title="Tạo khuyến nghị mới"
      width={420}
      onClose={onClose}
      open={open}
      bodyStyle={{ paddingBottom: 80 }}
      extra={
        <Space>
          <Button onClick={onClose}>Hủy</Button>
          <Button onClick={() => form.submit()} type="primary">
            <Typography>Tạo</Typography>
          </Button>
        </Space>
      }
    >
      <Form onFinish={handleSubmit} form={form} layout="vertical">
        <Spin spinning={loading}>
          <div>
            <Form.Item name="is_long_term" initialValue={false}>
              <Radio.Group defaultValue={false}>
                <Radio.Button value={false}>Ngắn hạn</Radio.Button>
                <Radio.Button value={true}>Dài hạn</Radio.Button>
              </Radio.Group>
            </Form.Item>
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
              <InputNumber
                style={{ width: '200px' }}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                min={0}
              />
            </Form.Item>
            <Form.Item
              label="Giá cắt lỗ"
              name="target_stop_loss"
              rules={[
                { required: true, message: 'Vui lòng điền vào trường này' },
                {
                  validator(_, value: string) {
                    const buy_price = form.getFieldValue('target_buy_price');

                    if (buy_price > value) {
                      return Promise.resolve();
                    }

                    return Promise.reject(new Error('Giá cắt lỗ phải bé hơn giá mua'));
                  },
                },
              ]}
            >
              <InputNumber
                style={{ width: '200px' }}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                min={0}
              />
            </Form.Item>

            <Form.Item
              label="Giá chốt lời 1"
              name="target_sell_price_1"
              rules={[
                { required: true, message: 'Vui lòng điền vào trường này' },
                {
                  validator(_, value: number) {
                    const buy_price = form.getFieldValue('target_buy_price');

                    if (buy_price < value) {
                      return Promise.resolve();
                    }

                    return Promise.reject(new Error('Giá chốt lời 1 phải lớn hơn giá mua'));
                  },
                },
              ]}
            >
              <InputNumber
                style={{ width: '200px' }}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                min={0}
              />
            </Form.Item>
            <Form.Item
              label="Giá chốt lời 2"
              name="target_sell_price_2"
              rules={[
                { required: true, message: 'Vui lòng điền vào trường này' },
                {
                  validator(_, value: number) {
                    const sell_1 = form.getFieldValue('target_sell_price_1');

                    if (sell_1 < value) {
                      return Promise.resolve();
                    }

                    return Promise.reject(new Error('Giá chốt lời 2 phải lớn hơn chốt lời 1'));
                  },
                },
              ]}
            >
              <InputNumber
                style={{ width: '200px' }}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                min={0}
              />
            </Form.Item>

            <Form.Item
              label="Giá chốt lời 3"
              name="target_sell_price_3"
              rules={[
                { required: true, message: 'Vui lòng điền vào trường này' },
                {
                  validator(_, value: number) {
                    const sell_2 = form.getFieldValue('target_sell_price_2');

                    if (sell_2 < value) {
                      return Promise.resolve();
                    }

                    return Promise.reject(new Error('Giá chốt lời 3 phải lớn hơn chốt lời 2'));
                  },
                },
              ]}
            >
              <InputNumber
                style={{ width: '200px' }}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                min={0}
              />
            </Form.Item>

            <Form.Item name="note" label="Ghi chú">
              <TextArea autoSize placeholder={'Ghi chú'}></TextArea>
            </Form.Item>

            {/* <Form.Item name="image_chart" label="Ảnh chart">
              <Upload
                action=""
                listType="picture"
                maxCount={1}
                accept="image/png, image/gif, image/jpeg"
                onChange={handleChange}
                beforeUpload={_ => {
                  return false;
                }}
              >
                <Space size="large">
                  <Button icon={<UploadOutlined />}>Upload (Max: 1)</Button>
                </Space>
              </Upload>
            </Form.Item> */}
            <Form.Item name="image_chart" label="Ảnh chart" valuePropName="fileList" getValueFromEvent={normFile}>
              <Upload
                name="image"
                action=""
                listType="picture"
                maxCount={1}
                accept="image/png, image/gif, image/jpeg"
                beforeUpload={_ => {
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />}>Click to upload</Button>
              </Upload>
            </Form.Item>
          </div>
        </Spin>
      </Form>
    </Drawer>
  );
}

export default CreateSingalDrawer;
