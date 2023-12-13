/* eslint-disable @typescript-eslint/no-unused-vars */
import type { SignalModel } from '@/interface/signal';
import type { RangePickerProps } from 'antd/es/date-picker';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue } from 'antd/es/table/interface';

import './index.less';

import { LoadingOutlined, MenuOutlined } from '@ant-design/icons';
import { Button, DatePicker, Dropdown, notification, Table, Typography } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { approveInvoice, createInvoice, getInvoice } from '@/api/invoice';
import { addTag } from '@/stores/tags-view.store';

import Result from '../components/result/Result';
import { getColumnSearchProps } from '../components/Table/SearchInTable';
import BoxFilter from './boxFilter';

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}

const disabledDate: RangePickerProps['disabledDate'] = current => {
  return current && current > dayjs().subtract(1, 'month').endOf('month');
};

const Invoicetable: React.FC = () => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState('');

  const [sort, setSort] = useState<string>('');

  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      pageSizeOptions: [10, 20, 50],
    },
  });

  // search
  const [staffCode, setStaffCodeSearch] = useState(null);
  const [paymentCode, setPaymentCode] = useState(null);
  const [name, setNameSearch] = useState(null);
  const [email, setEmailSearch] = useState(null);
  const [phone, setPhoneSearch] = useState(null);

  //enum true: dài hạn,false: ngắn hạn
  const [typeFilter, setTypeFilter] = useState(null);
  //enum ['closed', 'new', 'open']
  const [statusFilter, setStatusFilter] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState(null);
  const [codeFilter, setCodeFilter] = useState<string>('');
  const [dateSort, setDateSort] = useState('DESC');

  const [filterQuery, setFilterQuery] = useState('');
  const [filterQueryBox, setFilterQueryBox] = useState('');

  const actions = (record: any) => {
    const actionList = [];

    actionList.push({
      key: '5',
      label: (
        <Typography
          onClick={() => {
            console.log(record);
            handleApprove(record.id);
          }}
        >
          {'Duyệt'}
        </Typography>
      ),
    });

    return actionList;
  };

  const actionsColumn = {
    title: '',
    width: '10%',
    editable: false,
    render: (_: any, record: any) => (
      <Dropdown menu={{ items: actions(record) }} arrow placement="bottom">
        <Button type="ghost" size="small" shape="circle">
          <MenuOutlined />
        </Button>
      </Dropdown>
    ),
  };
  const dispatch = useDispatch();

  const handelAddTag = (id: string, name: string) => {
    dispatch(
      addTag({
        code: 'con',
        closable: true,
        label: {
          en_US: `${name}`,
          zh_CN: 'asdas',
        },
        path: `/invoice/detail/${id}`,
      }),
    );
  };

  const columns: ColumnsType<any> = [
    {
      title: 'Mã chứng từ',
      dataIndex: 'payment_code',
      width: '10%',
      ...getColumnSearchProps({
        setFilter: setStaffCodeSearch,
      }),
      render: (_: any, record: any) => {
        return (
          <Link
            to={'/invoice/detail/' + record?.id}
            style={{ textDecoration: 'none' }}
            onClick={() => handelAddTag(record?.id, record?.payment_code)}
          >
            {_}
          </Link>
        );
      },
    },
    {
      title: 'Kỳ thanh toán',
      dataIndex: 'payment_period',
      width: '10%',
      render: (_, record) => <Typography.Text>{moment(record?.payment_period).format('YYYY/MM')}</Typography.Text>,
      // filters: [
      //   // { text: 'Premium 12 tháng', value: 'trial' },
      //   // { text: 'Premium 6 tháng', value: 'vip' },
      //   // { text: 'Premium 3 tháng', value: 'premium' },
      //   // { text: 'Premium 1 tháng', value: 'premium' },
      // ],
    },
    {
      title: 'Mã KH',
      dataIndex: ['sale', 'staff_code'],
      width: '8%',
      ...getColumnSearchProps({
        setFilter: setStaffCodeSearch,
      }),
    },
    {
      title: 'Email',
      dataIndex: ['sale', 'email'],
      width: '15%',
      ...getColumnSearchProps({
        setFilter: setEmailSearch,
      }),
    },
    {
      title: 'SDT',
      dataIndex: ['sale', 'phone_number'],
      width: '10%',
      ...getColumnSearchProps({
        setFilter: setPhoneSearch,
      }),
    },
    {
      title: 'Hoa hồng thanh toán trong kỳ',
      dataIndex: 'commission_in_period',
      width: '15%',
      render: (_: any, record: any) => {
        return parseInt(_).toLocaleString();
      },
      sorter: true,
    },
    {
      title: 'Hoa hồng tạm tính',
      dataIndex: 'commission_provisional',
      width: '10%',
      render: (_: any, record: any) => {
        return parseInt(_).toLocaleString();
      },
      sorter: true,
    },
    {
      title: 'Tình trạng',
      dataIndex: 'status',
      width: '10%',
      render: (_: any, record: any) => {
        return _ == 'pending' ? 'Chưa duyệt' : 'Đã duyệt';
      },
    },
    actionsColumn,
  ];

  const getData = async () => {
    setLoading(true);
    await getInvoice(tableParams.pagination, filterQuery, sort, filterQueryBox)
      .then((data: any) => {
        if (data.code === 200) {
          setTableParams({
            ...tableParams,
            pagination: {
              ...tableParams.pagination,
              total: data?.data?.count,
            },
          });
          // const columns = data?.data?.rows?.map((item: any) => {
          //   return {
          //     ...item,
          //   };
          // });

          // console.log('data______________________', data);
          setData(data?.data?.rows);
        }
      })
      .catch(error => {
        console.log(error);
      });

    setLoading(false);
  };

  const handleApprove = async (id: string) => {
    await approveInvoice(id)
      .then((res: any) => {
        if (res.code === 200) {
          const new_data = [...data].map((item: any) => {
            if (item.id === id) {
              return {
                ...item,
                status: 'approve',
              };
            }

            return item;
          });

          setData(new_data);
          notification.success({
            message: 'Thao tác thành công!',
          });
        }
      })
      .catch(err => {
        console.log(err);
        notification.error({
          message: err.message,
        });
      });
  };

  useEffect(() => {
    if (name != null || email != null || staffCode != null || phone != null) {
      let query = '';

      if (name) {
        query += `&name=${name}`;
      }

      if (email) {
        query += `&email=${email}`;
      }

      if (staffCode) {
        query += `&staff_code=${staffCode}`;
      }

      if (phone) {
        query += `&phone=${phone}`;
      }

      if (paymentCode) {
        query += `&payment_code=${paymentCode}`;
      }

      console.log(query);
      //////////////////
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          current: 1,
        },
      });
      setFilterQuery(query);
    }
  }, [name, email, phone, staffCode, paymentCode]);

  useEffect(() => {
    getData();
  }, [JSON.stringify(tableParams), filterQuery, filterQueryBox]);

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }

    if (sorter.order === 'ascend') {
      const sorte = `${sorter.field}_order=ASC`;

      setSort(sorte);
    } else if (sorter.order === 'descend') {
      const sorte = `${sorter.field}_order=DESC`;

      setSort(sorte);
    }
  };

  const handleCreateInvoice = async () => {
    if (loading) return;
    setLoading(true);
    await createInvoice(period)
      .then((res: any) => {
        console.log(res);

        if (res.code === 200) {
          getData();
          notification.success({
            message: 'Thao tác thành công!',
          });
        }
      })
      .catch(err => {
        console.log(err);
        notification.error({
          message: err.message,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleResetFilter = () => {
    setFilterQuery('');
    setFilterQueryBox('');
  };

  console.log('___to day______________________', dayjs().endOf('day'));

  return (
    <div className="aaa">
      <div style={{ textAlign: 'center' }}>
        <Typography.Title level={2}>Chứng từ thanh toán</Typography.Title>
      </div>
      <BoxFilter setQueryFilter={setFilterQueryBox} resetQuery={handleResetFilter} />
      <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
        <DatePicker
          onChange={(e: any) => {
            // console.log(moment(e.$d).format('YYYY-MM-DD'));
            setPeriod(moment(e.$d).format('YYYY-MM-DD'));
          }}
          picker="month"
          placeholder="Chọn kỳ thanh toán"
          style={{ width: 180 }}
          disabledDate={disabledDate}
        />
        <Button
          onClick={() => {
            handleCreateInvoice();
          }}
        >
          {loading ? <LoadingOutlined /> : 'Tính toán'}
        </Button>
      </div>
      {/* <Button onClick={handleResetFilter}>Reset bộ lọc</Button> */}
      <Result total={tableParams.pagination?.total} isButtonExcel={false} />
      <div className="invoice_table">
        <Table
          columns={columns}
          rowKey={record => record.id}
          dataSource={data}
          pagination={tableParams.pagination}
          loading={loading}
          onChange={handleTableChange}
          scroll={{ x: 'max-content', y: '100%' }}
          style={{ height: 'auto' }}
        />
      </div>
    </div>
  );
};

export default Invoicetable;
