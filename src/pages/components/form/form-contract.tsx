/* eslint-disable @typescript-eslint/no-unused-vars */
import type { DatePickerProps } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AutoComplete, Button, DatePicker, Form, Input, InputNumber, Select, Spin, Switch } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import moment from 'moment';
import { Fragment, useEffect, useState } from 'react';

import { listCustomerApi } from '@/api/ttd_list_customer';

const { Option } = Select;

const { getSaleList, getListUser } = listCustomerApi;
const { RangePicker } = DatePicker;

interface IEditRequest {
  setUpdateDataSp: (updateData: any) => void;
  initForm?: any;
  setNewContract: (data: any) => void;
  loading: boolean;
}

const rangeConfig = {
  rules: [{ type: 'array' as const, required: true, message: 'Không được bỏ trống!' }],
};

const CreateContract: React.FC<IEditRequest> = ({ setUpdateDataSp, initForm, setNewContract, loading }) => {
  const [option, setOption] = useState<{ id: string; value: string; fullname: string }[]>([]);
  const [option2, setOption2] = useState<{ id: string; value: string; email: string; fullname: string }[]>([]);
  const [nameSelect, setNameSelect] = useState('');
  const [saleSelect, setsaleSelect] = useState('');
  const [selectFinish, setSelectFinish] = useState('');
  const [isDisable, setIsDisable] = useState<boolean>(true);
  const [percentProfit, setpercentProfit] = useState(0);
  const [init, setInit] = useState<number | undefined>(undefined);

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
      const newOption = data?.data?.rows.map((item: any) => ({
        value: item?.email,
        id: item?.id,
        fullname: item?.fullname,
      }));

      setOption(newOption);
      // console.log('_______________________________', newOption);
    }

    if (userData.data) {
      const newOption2 = userData.data?.map((item: any) => ({
        value: item?.customer_code,
        id: item?.id,
        email: item?.email,
        fullname: item?.fullname,
      }));

      setOption2(newOption2);
    }
  }, [data, userData.data]);

  useEffect(() => {
    if (initForm) {
      const toDay = new Date();
      const end_date = new Date(initForm?.end_date);

      console.log('end_ddate______________', end_date);
      console.log('today______________________', toDay);
      // console.log(end_date > toDay);

      const setInitForm = {
        ...initForm,
        fullname: initForm?.name,
        email: initForm?.email,
        sale_name: option.find(item => item?.fullname === initForm?.name_sale)?.value,
        customer_id: option2.find(item => item?.fullname === initForm?.name)?.value,
        sale_id: option.find(item => item?.fullname === initForm?.name_sale)?.id,
        // time_contract: [moment('2023-08-26'), moment('2023-08-29')],
        status: end_date > toDay,
      };

      form.setFieldsValue(setInitForm);
    } else {
      form.resetFields();
    }
  }, [initForm]);

  useEffect(() => {
    if (nameSelect) {
      const emailSelect = option2.find(item => item.value === nameSelect)?.email;
      const name = option2.find(item => item.value === nameSelect)?.fullname;

      form.setFieldsValue({
        email: emailSelect,
        fullname: name,
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
    const rangeValue = values['time_contract'];
    const timeSelect = [rangeValue[0].format('YYYY-MM-DD'), rangeValue[1].format('YYYY-MM-DD')];
    // console.log('values______________', values);

    // console.log("timeSelect________________", timeSelect);

    const customer_id = option2.find(item => item.value === values?.customer_id)?.id;

    const newValues = {
      ...values,
      ...days,
      customer_id,
    };

    // console.log("day______________________", days);
    // console.log("new value______________________", newValues);

    if (!initForm) {
      setNewContract(newValues);
    } else {
      setUpdateDataSp(newValues);
    }
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

  const handleSelectFinish = (value: string) => {
    // console.log('value)))))))))))))))', value);
    setSelectFinish(value);

    if (value === '2') {
      setIsDisable(false);
    } else if (value === '1') {
      setIsDisable(true);
    }
  };

  const handleOnchange = (value: number) => {
    // console.log('value_________________', value);

    if (init) {
      const percent = value / init - 1;

      setpercentProfit(percent);
      form.setFieldsValue({
        profit_percent: percent,
      });
    }
  };

  // console.log('init form_____________', initForm);
  // console.log('percentProfit_______________________', percentProfit);

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
        <Form.Item
          name="customer_id"
          label="Mã khách hàng"
          rules={[{ required: true, message: 'Không đc bỏ trống !', whitespace: true }]}
        >
          <AutoComplete
            style={{ width: '100%' }}
            options={option2}
            placeholder="Nhập mã khách hàng"
            filterOption={(inputValue, option) => option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
            size="large"
            onChange={value => setNameSelect(value)}
          />
        </Form.Item>

        <Form.Item name="fullname" label="Tên khách hàng">
          <Input disabled />
        </Form.Item>

        {/* <Form.Item
          name="phone_number"
          label="Số điện thoại"
          rules={[{ required: true, message: 'Không đc bỏ trống !' }]}
        >
          <Input />
        </Form.Item> */}

        <Form.Item name="email" label="Email">
          <Input disabled />
        </Form.Item>

        <Form.Item
          name="sale_name"
          label="Nhân viên quản lý"
          rules={[{ required: true, message: 'Vui lòng nhập email nhân viên!' }]}
        >
          <AutoComplete
            style={{ width: '100%' }}
            options={option}
            placeholder="Nhập email nhân viên quản lý"
            filterOption={(inputValue, option) => option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
            size="large"
            onChange={value => setsaleSelect(value)}
          />
        </Form.Item>

        <Form.Item name="sale_id" label="Mã nhân viên quản lý">
          <Input disabled />
        </Form.Item>

        <Form.Item name="contract_no" label="Số hợp đồng" rules={[{ required: true, message: 'Không đc bỏ trống !' }]}>
          <Input />
        </Form.Item>

        <Form.Item name="time_contract" label="Thời gian hợp đồng" {...rangeConfig}>
          <RangePicker format="YYYY/MM/DD" onChange={onChange} />
        </Form.Item>

        <Form.Item
          name="initial_value"
          label="Giá trị tài khoản ban đầu"
          rules={[{ required: true, message: 'Không đc bỏ trống !' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            min={0}
            value={init}
            onChange={value => setInit(value as number)}
          />
        </Form.Item>

        <Form.Item
          name="end_value"
          label="Giá trị tài khoản khi kết thúc"
          hasFeedback
          // rules={[{ required: true, message: 'Không đc bỏ trống !' }]}
        >
          {/* <InputNumber
            style={{ width: '100%' }}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            min={0}
          /> */}
          <Select placeholder="Giá trị TK kết thúc/ % Lợi nhuận" onChange={handleSelectFinish}>
            <Option value="1">Giá trị tài khoản kết thúc</Option>
            <Option value="2">% Lợi nhuận</Option>
          </Select>
        </Form.Item>

        {selectFinish && isDisable && (
          <Form.Item
            name="expected_end_value"
            label="Nhập giá trị Tk kết thúc"
            hasFeedback
            // rules={[{ required: true, message: 'Không đc bỏ trống !' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              min={0}
              onChange={value => handleOnchange(value as number)}
            />
          </Form.Item>
        )}

        <Form.Item
          name="profit_percent"
          label="% Lợi nhuận dự kiến: xx.xx %"
          rules={[{ required: true, message: 'Không đc bỏ trống !' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            formatter={value => `${value} %`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            min={0}
            disabled={isDisable}
            // value={percentProfit}
          />
        </Form.Item>
        <Form.Item name="status" label="Tình trạng hợp đồng" valuePropName="checked">
          <Switch unCheckedChildren="Thanh lý" checkedChildren="Còn hiệu lực" />
        </Form.Item>
        {/* <Form.Item
          name="commission"
          label="% lợi nhuận dự kiến"
          rules={[{ required: true, message: 'Không đc bỏ trống !' }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            min={0}
            // defaultValue={0}
          />
        </Form.Item> */}

        <Form.Item name="note" label="Ghi chú">
          <TextArea />
        </Form.Item>

        <Form.Item style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '' }}>
          <Spin spinning={loading}>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Spin>
        </Form.Item>
      </Form>
    </Fragment>
  );
};

export default CreateContract;
