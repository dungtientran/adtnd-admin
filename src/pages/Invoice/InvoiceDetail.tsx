import type { TablePaginationConfig } from 'antd/es/table';
import type { FilterValue } from 'antd/es/table/interface';

import { Skeleton, Space, Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getInvoiceDetail } from '@/api/invoice';

import CommissionTable from './CommissionTable';
import ContractTable from './ContractTable';

const { Text } = Typography;

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}

const Recommendations: React.FC = () => {
  const param = useParams();
  const id = param.id;
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const getData = async (id: string) => {
    setLoading(true);
    await getInvoiceDetail(id)
      .then((data: any) => {
        if (data.code === 200) {
          setData(data.data);
        }
      })
      .catch(error => {
        console.log(error);
      });

    setLoading(false);
  };

  useEffect(() => {
    getData(id as string);
  }, [id]);

  const getTotalContractValue = () => {
    return data?.contract?.reduce((accumulator: any, currentValue: any) => {
      return accumulator + parseInt(currentValue?.contract_commission?.sales_commission);
    }, 0);
  };

  const getTotalCommissionValue = () => {
    return data?.commission?.reduce((accumulator: any, currentValue: any) => {
      return accumulator + parseInt(currentValue?.amount);
    }, 0);
  };

  console.log('___________________________id', id);

  return (
    <div className="aaa">
      <div style={{ textAlign: 'center' }}>
        <Typography.Title level={2}>Bảng chi tiết hoa hồng</Typography.Title>
      </div>
      <Space direction="vertical">
        <Space>
          <Text strong>Kỳ thanh toán: </Text>
          {loading ? <Spin spinning={true} size="small" /> : <Text>{data?.invoice?.payment_period}</Text>}
        </Space>
        <Space>
          <Text strong>Mã khách hàng: </Text>
          {loading ? <Spin spinning={true} size="small" /> : <Text>{data?.invoice?.sale?.staff_code}</Text>}
        </Space>
        <Space>
          <Text strong>Tên khách hàng: </Text>
          {loading ? <Spin spinning={true} size="small" /> : <Text>{data?.invoice?.sale?.fullname}</Text>}
        </Space>
        <Space>
          <Text strong>SĐT: </Text>
          {loading ? <Spin spinning={true} size="small" /> : <Text>{data?.invoice?.sale?.phone_number}</Text>}
        </Space>
        <Space>
          <Text strong>Email: </Text>
          {loading ? <Spin spinning={true} size="small" /> : <Text>{data?.invoice?.sale?.email}</Text>}
        </Space>
      </Space>
      <div>
        <Typography.Title level={3} style={{ textAlign: 'center' }}>
          Gói Premium
        </Typography.Title>
        <Typography.Title level={5} style={{ textAlign: 'center' }}>
          Tổng cộng : {getTotalCommissionValue()?.toLocaleString()}
        </Typography.Title>
        <CommissionTable data={data?.commission} />
      </div>

      <div>
        <Typography.Title level={3} style={{ textAlign: 'center' }}>
          Hoa hồng
        </Typography.Title>
        <Typography.Title level={5} style={{ textAlign: 'center' }}>
          Tổng cộng : {getTotalContractValue()?.toLocaleString()}
        </Typography.Title>
        <ContractTable data={data?.contract} />
      </div>
    </div>
  );
};

export default Recommendations;
