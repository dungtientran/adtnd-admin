/* eslint-disable @typescript-eslint/no-unused-vars */
import type { DatePickerProps } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AutoComplete, Button, DatePicker, Form, Input, InputNumber, Switch } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { Fragment, useEffect, useState } from 'react';

import { listCustomerApi } from '@/api/ttd_list_customer';

const { getSaleList, getListUser } = listCustomerApi;
const { RangePicker } = DatePicker;

interface IEditRequest {
  setUpdateDataSp: (updateData: any) => void;
  initForm?: any;
  setNewContract: (data: any) => void;
}

const CreateContract: React.FC<IEditRequest> = ({ setUpdateDataSp, initForm, setNewContract }) => {
  const [option, setOption] = useState<{ id: string; value: string }[]>([]);
  const [option2, setOption2] = useState<{ id: string; value: string; email: string; customer_code: string }[]>([]);
  const [nameSelect, setNameSelect] = useState('');
  const [saleSelect, setsaleSelect] = useState('');
  const [days, setDays] = useState({
    start_date: '',
    end_date: '',
  });
  const { data, isLoading, isError } = useQuery({
    queryKey: ['getSaleList'],
    queryFn: () => getSaleList(),
  });

  const userData = useQuery({
    queryKey: ['getListUser'],
    queryFn: () => getListUser(''),
  });

  useEffect(() => {
    if (data) {
      const newOption = data?.data?.rows.map((item: any) => ({ value: item?.fullname, id: item?.id }));

      setOption(newOption);
    }

    if (userData.data) {
      const newOption2 = userData.data?.map((item: any) => ({
        value: item?.fullname,
        id: item?.id,
        email: item?.email,
        customer_code: item?.customer_code,
      }));

      setOption2(newOption2);
    }
  }, [data, userData.data]);

  useEffect(() => {
    if (initForm) {
      form.setFieldsValue(initForm);
    } else {
      form.resetFields();
    }
  }, [initForm]);

  useEffect(() => {
    if (nameSelect) {
      const emailSelect = option2.find(item => item.value === nameSelect)?.email;
      const customer_id_select = option2.find(item => item.value === nameSelect)?.customer_code;

      form.setFieldsValue({
        email: emailSelect,
        customer_id: customer_id_select,
      });
    }

    if (saleSelect) {
      const sale_id_select = option.find(item => item.value === saleSelect)?.id;

      form.setFieldsValue({
        sale_id: sale_id_select,
      });
    }
  }, [nameSelect, saleSelect]);

  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    // setUpdateDataSp(values);
    // console.log('Received values of form: ', values);
    const customer_id = option2.find(item => item.value === values?.fullname)?.id;

    const newValues = {
      ...values,
      ...days,
      customer_id,
    };

    // console.log('Received values of form: ', newValues);
    setNewContract(newValues);
  };

  const onChange = (
    value: DatePickerProps['value'] | RangePickerProps['value'],
    dateString: [string, string] | string,
  ) => {
    // console.log('Selected Time: ', value);
    // console.log('Formatted Selected Time: ', dateString);
    setDays({
      end_date: dateString[1],
      start_date: dateString[0],
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
      >
        <Form.Item name="customer_id" label="Mã KH" rules={[{ required: true, message: 'Không đc bỏ trống !' }]}>
          <Input />
        </Form.Item>

        <Form.Item
          name="fullname"
          label="Tên khách hàng"
          rules={[{ required: true, message: 'Không đc bỏ trống !', whitespace: true }]}
        >
          <AutoComplete
            style={{ width: '100%' }}
            options={option2}
            placeholder="Nhập email nhân viên hỗ trợ"
            filterOption={(inputValue, option) => option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
            size="large"
            onChange={value => setNameSelect(value)}
          />
        </Form.Item>

        {/* <Form.Item
          name="phone_number"
          label="Số điện thoại"
          rules={[{ required: true, message: 'Không đc bỏ trống !' }]}
        >
          <Input />
        </Form.Item> */}

        <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Không đc bỏ trống !' }]}>
          <Input />
        </Form.Item>

        <Form.Item
          name="sale_id"
          label="Mã nhân viên quản lý"
          rules={[{ required: true, message: 'Không đc bỏ trống !' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="sale"
          label="Nhân viên quản lý"
          rules={[{ required: true, message: 'Vui lòng nhập email nhân viên!' }]}
        >
          <AutoComplete
            style={{ width: '100%' }}
            options={option}
            placeholder="Nhập email nhân viên hỗ trợ"
            filterOption={(inputValue, option) => option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
            size="large"
            onChange={value => setsaleSelect(value)}
          />
        </Form.Item>

        <Form.Item name="contract_no" label="Số hợp đồng" rules={[{ required: true, message: 'Không đc bỏ trống !' }]}>
          <Input />
        </Form.Item>

        <Form.Item name="" label="Thời gian hợp đồng" rules={[{ required: true, message: 'Không đc bỏ trống !' }]}>
          <RangePicker format="YYYY/MM/DD" onChange={onChange} />
        </Form.Item>

        <Form.Item
          name="initial_value"
          label="Giá trị tài khoản ban đầu"
          rules={[{ required: true, message: 'Không đc bỏ trống !' }]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          name="expected_end_value"
          label="Giá trị tài khoản khi kết thúc"
          rules={[{ required: true, message: 'Không đc bỏ trống !' }]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          name="commission"
          label="% lợi nhuận dự kiến"
          rules={[{ required: true, message: 'Không đc bỏ trống !' }]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item name="note" label="Ghi chú" rules={[{ required: true, message: 'Không đc bỏ trống !' }]}>
          <TextArea />
        </Form.Item>

        <Form.Item style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '' }}>
          <Button type="primary" htmlType="submit">
            Lưu
          </Button>
        </Form.Item>
      </Form>
    </Fragment>
  );
};

export default CreateContract;
