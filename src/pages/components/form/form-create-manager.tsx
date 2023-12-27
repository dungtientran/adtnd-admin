/* eslint-disable @typescript-eslint/no-unused-vars */
import type { UseMutationResult } from '@tanstack/react-query';

import { useQuery } from '@tanstack/react-query';
import { AutoComplete, Button, Form, Input, InputNumber, Select, Space, Spin, Typography } from 'antd';
import { Fragment, useEffect, useState } from 'react';

import { listCustomerApi } from '@/api/ttd_list_customer';
import { salePosition } from '@/pages/UserManagement/UserManagement/UserManagement';

const { Title } = Typography;
const { getSaleList } = listCustomerApi;

interface ICreateUser {
  initForm?: any;
  useSale: () => {
    create: UseMutationResult<any, any, any, unknown>;
  };
}

const CreateManager: React.FC<ICreateUser> = ({ initForm, useSale }) => {
  const [option, setOption] = useState<
    { id: string; value: string; name: string; customer_code: string; email: string; phone_number: string }[]
  >([]);
  const [option2, setOption2] = useState<{ id: string; value: string; name: string }[]>([]);

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
  const [derectorSelect, setDerectorSelect] = useState('');

  const [salePositionSelect, setSalePosition] = useState('');

  const saleData = useQuery({
    queryKey: ['getSaleList'],
    queryFn: () => getSaleList(),
  });

  const { create } = useSale();

  useEffect(() => {
    if (saleData?.data?.data) {
      const managerOptions = saleData?.data?.data?.rows?.filter((item: any) => item?.SaleLevel?.level === 0);
      const directorOptions = saleData?.data?.data?.rows?.filter((item: any) => item?.SaleLevel?.level === 1);

      const newOption2 = managerOptions?.map((item: any) => ({
        value: item?.staff_code,
        id: item?.id,
        name: item?.fullname,
        email: item?.email,
        customer_code: item?.staff_code,
        phone_number: item?.phone_number,
      }));

      const newDirectorOptions = directorOptions?.map((item: any) => ({
        value: item?.staff_code,
        id: item?.id,
        name: item?.fullname,
      }));

      setOption(newOption2);
      setOption2(newDirectorOptions);
    }
  }, [saleData?.data?.data]);

  // console.log('saleDataData_______________________', saleData.data.data.rows);

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
    if (saleSelect || derectorSelect) {
      const sale_id_select = option.find(item => item.value === saleSelect)?.name;
      const derector_name_select = option2.find(item => item.value === derectorSelect)?.name;

      form.setFieldsValue({
        fullname: sale_id_select,
        director_name: derector_name_select,
      });
    }
  }, [saleSelect, derectorSelect]);

  const [form] = Form.useForm();

  const handleCreateSale = (newSale: any) => {
    create.mutate(newSale);
  };

  const onFinish = (values: any) => {
    const parent_admin_id = option2.find(item => item.value === values?.parent_admin_id)?.id;
    const child_admin_id = option.find(item => item.value === values?.child_admin_id)?.id;

    const createData = {
      parent_admin_id,
      child_admin_id,
    };

    const updateSale = {};

    handleCreateSale(createData);

    // console.log('createData____________________________', createData);
  };

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
        <Title level={5}>Sales:</Title>
        {!initForm ? (
          <>
            <Form.Item
              name="child_admin_id"
              label="Mã nhân viên"
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
            <Form.Item name="fullname" label="Họ tên">
              <Input disabled />
            </Form.Item>
          </>
        ) : (
          <Form.Item
            name="staff_code"
            label="Mã nhân viên"
            // rules={[{ required: true, message: 'Không đc bỏ trống !', whitespace: true }]}
          >
            <Input disabled />
          </Form.Item>
        )}
        <Title level={5}>Trưởng phòng:</Title>
        {!initForm ? (
          <>
            <Form.Item
              name="parent_admin_id"
              label="Mã nhân viên"
              rules={[{ required: true, message: 'Không đc bỏ trống !', whitespace: true }]}
            >
              <AutoComplete
                style={{ width: '100%' }}
                options={option2}
                placeholder="Nhập mã khách hàng"
                filterOption={(inputValue, option) =>
                  option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
                size="large"
                onChange={value => setDerectorSelect(value)}
                disabled={initForm}
              />
            </Form.Item>
            <Form.Item
              name="director_name"
              label="Họ tên"
              rules={[{ required: true, message: 'Không đc bỏ trống !', whitespace: true }]}
            >
              <Input disabled />
            </Form.Item>
          </>
        ) : (
          <Form.Item
            name="staff_code"
            label="Mã nhân viên"
            // rules={[{ required: true, message: 'Không đc bỏ trống !', whitespace: true }]}
          >
            <Input disabled />
          </Form.Item>
        )}

        <Form.Item style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '' }}>
          <Spin spinning={create.isLoading}>
            <Button type="primary" htmlType="submit">
              {initForm ? 'Lưu' : 'Tạo mới'}
            </Button>
          </Spin>
        </Form.Item>
      </Form>
    </Fragment>
  );
};

export default CreateManager;
