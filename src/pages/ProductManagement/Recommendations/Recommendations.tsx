import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';

import { BorderOuterOutlined, MenuOutlined, UploadOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Dropdown,
  notification,
  Popconfirm,
  Row,
  Select,
  Slider,
  Space,
  Table,
  Tag,
  Typography,
  Upload,
} from 'antd';
import axios from 'axios';
import moment from 'moment';
import qs from 'qs';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { getSignalList, sendSignalNotification } from '@/api/signal';
import MyButton from '@/components/basic/button';
import MyModal from '@/components/basic/modal';
import ConfirmDeleteModal from '@/components/modal/Signal/ConfirmDeleteModal';
import CreateSignalModal from '@/components/modal/Signal/CreateSignalModa';
import SendSignalNotificationModal from '@/components/modal/Signal/SendNotificationModal';

interface DataType {
  id: string;
  code: string;
  en_name: string;
  logo_url: string;
  market: string;
  name: string;
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}
const { RangePicker } = DatePicker;
const getRandomuserParams = (params: TableParams) => ({
  results: params.pagination?.pageSize,
  page: params.pagination?.current,
  ...params,
});

const Recommendations: React.FC = () => {
  const [data, setData] = useState([]);
  const subscriptions = useSelector(state => state.subsciptions.subscriptions);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState<boolean>(false);

  // notifications state
  const [notificationModalOpen, setNotificationModalOpen] = useState<boolean>(false);
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    description: '',
    signal_id: '',
    signal_ids: [],
    loading: false,
  });

  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [closeSignalModal, setCloseSignalModal] = useState<{ open: boolean; record: any }>({
    open: false,
    record: {} as any,
  });
  const [updateRow, setUpdateRow] = useState<any | null>(null);
  const [sendSignalModal, setSendSignalModal] = useState<{ open: boolean; record: any }>({
    open: false,
    record: {} as any,
  });
  const [createDateFilter, setCreateDateFilter] = useState({
    start_date: '',
    end_date: '',
  });
  const [closedDateFilter, setClosedDateFilter] = useState({
    start_date: '',
    end_date: '',
  });
  const [priceRangeFilter, setPriceRangeFilter] = useState([0, 150]);
  const [stoplossPriceRangeFilter, setStoplossPriceRangeFilter] = useState([0, 150]);
  const [closedPriceRangeFilter, setClosedPriceRangeFilter] = useState([0, 150]);
  const [targetSellPrice1RangeFilter, setTargetSellPrice1RangeFilter] = useState([0, 150]);
  const [targetSellPrice2RangeFilter, setTargetSellPrice2RangeFilter] = useState([0, 150]);
  const [targetSellPrice3RangeFilter, setTargetSellPrice3RangeFilter] = useState([0, 150]);

  //enum true: dài hạn,false: ngắn hạn
  const [typeFilter, setTypeFilter] = useState(null);
  //enum ['closed', 'new', 'open']
  const [statusFilter, setStatusFilter] = useState(null);

  const [filterQuery, setFilterQuery] = useState('');

  const onFilter = () => {
    let query = '';

    if (createDateFilter.end_date || createDateFilter.start_date) {
      query += '&start_date=' + createDateFilter.start_date + '&end_date=' + createDateFilter.end_date;
    }

    if (closedDateFilter.end_date || closedDateFilter.start_date) {
      query += '&closed_date_start=' + closedDateFilter.start_date + '&closed_date_end=' + closedDateFilter.end_date;
    }

    // ////////////////////
    if (typeFilter) {
      if (typeFilter == 1) {
        query += '&is_long_term=false';
      } else if (typeFilter == 2) {
        query += '&is_long_term=true';
      }
    }
    //////////////////

    if (statusFilter == 'closed') {
      query += '&is_closed=true';
    } else if (statusFilter == 'new') {
      query += '&is_approve=false';
    } else if (statusFilter == 'open') {
      query += '&is_approve=true';
    }

    query += '&target_buy_price_min=' + priceRangeFilter[0] + '&target_buy_price_max=' + priceRangeFilter[1];
    query +=
      '&target_sell_price_1_min=' +
      targetSellPrice1RangeFilter[0] +
      '&target_sell_price_1_max=' +
      targetSellPrice1RangeFilter[1];
    query +=
      '&target_sell_price_2_min=' +
      targetSellPrice2RangeFilter[0] +
      '&target_sell_price_2_max=' +
      targetSellPrice2RangeFilter[1];
    query +=
      '&target_sell_price_3_min=' +
      targetSellPrice3RangeFilter[0] +
      '&target_sell_price_3_max=' +
      targetSellPrice3RangeFilter[1];
    query +=
      '&target_stoploss_min=' + stoplossPriceRangeFilter[0] + '&target_stoploss_max=' + stoplossPriceRangeFilter[1];

    if (statusFilter == 'closed') {
      query += '&closed_price_min=' + closedPriceRangeFilter[0] + '&closed_price_max=' + closedPriceRangeFilter[1];
    }

    // cái này để mỗi lần nhất lọc đều triger function
    query += '&rd=' + Math.random().toString();
    setFilterQuery(query);
  };

  const actions = (record: any) => {
    const actionList = [];

    if (!record.is_approved) {
      actionList.push({
        key: '3',
        label: (
          <Typography
            onClick={() => {
              // onApproveSignal(record)
            }}
          >
            {'Duyệt'}
          </Typography>
        ),
      });
    }

    if (record.is_approved && !record.is_closed) {
      actionList.push({
        key: '4',
        label: (
          <Typography
            onClick={() => {
              console.log(record.id);
              setNotificationModalOpen(true);
              setNotificationForm({
                ...notificationForm,
                signal_id: record.id,
              });
            }}
          >
            {'Gửi thông báo'}
          </Typography>
        ),
      });
      actionList.push({
        key: '5',
        label: (
          <Typography
            onClick={() => {
              console.log(record);
              setCloseSignalModal({ open: true, record });
            }}
          >
            {'Đóng'}
          </Typography>
        ),
        danger: true,
      });
    }

    actionList.push({
      key: '2',
      label: (
        <Typography
          onClick={() => {
            // setUpdateRow(record);
            // setIsModalOpen(true);
          }}
        >
          {'Sửa'}
        </Typography>
      ),
    });
    actionList.push({
      key: '6',
      label: (
        <Typography
          onClick={() => {
            // onDeleteSignal(record)
          }}
        >
          {'Xóa'}
        </Typography>
      ),
      danger: true,
    });

    return actionList;
  };

  const actionsColumn = {
    title: 'ACTION',
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

  const columns: ColumnsType<any> = [
    {
      title: 'Mã CK',
      dataIndex: 'code',
      width: '5%',
      // sorter: (a: any, b: any) => a.code.localeCompare(b.code),
      // sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      width: '10%',
    },
    {
      title: 'Giá mua',
      dataIndex: 'target_buy_price',
      width: '8%',
    },
    {
      title: 'Giá bán mục tiêu 1',
      dataIndex: 'target_sell_price_1',
      width: '8%',
    },
    {
      title: 'Giá bán mục tiêu 2',
      dataIndex: 'target_sell_price_2',
      width: '8%',
    },
    {
      title: 'Giá bán mục tiêu 3',
      dataIndex: 'target_sell_price_3',
      width: '8%',
    },
    {
      title: 'Giá cắt lỗ',
      dataIndex: 'target_stop_loss',
      width: '6%',
    },
    {
      title: 'Giá đóng',
      dataIndex: 'closed_price',
      width: '8%',
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'action_date',
      width: '12%',
      sorter: (a: any, b: any) => a.action_date.localeCompare(b.action_date),
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: 'Ngày đóng',
      dataIndex: 'closed_date',
      width: '12%',
      sorter: (a: any, b: any) => a.closed_date.localeCompare(b.closed_date),
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: 'Loại',
      dataIndex: 'is_long_term',
      width: '10%',
      render: (is_long_term: boolean) => {
        if (is_long_term) {
          return 'Dài hạn';
        } else {
          return 'Ngắn hạn';
        }
      },
    },
    {
      title: 'Tình trạng',
      dataIndex: 'is_closed',
      width: '1%',
      render: (is_closed: boolean, record: any) => (
        <>
          {is_closed ? (
            <Tag color="red">Đóng</Tag>
          ) : record.is_approved ? (
            <Tag color="geekblue">Đã duyệt</Tag>
          ) : (
            <Tag color="green">Mới</Tag>
          )}
        </>
      ),
    },
    actionsColumn,
  ];

  const getSignal = async () => {
    setLoading(true);
    await getSignalList(tableParams.pagination, filterQuery)
      .then(data => {
        if (data.code === 200) {
          setTableParams({
            ...tableParams,
            pagination: {
              ...tableParams.pagination,
              total: data?.data?.count,
            },
          });
          console.log(data.data);
          setData(data?.data?.rows);
        }
      })
      .catch(error => {
        console.log(error);
      });

    setLoading(false);
  };

  useEffect(() => {
    getSignal();
  }, [JSON.stringify(tableParams), filterQuery]);

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    console.log(pagination);
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  const handleDeleteMany = async () => {};

  const handlesendSinalNotification = async () => {
    setNotificationForm({
      ...notificationForm,
      loading: true,
    });

    await sendSignalNotification({
      signal_id: notificationForm.signal_id,
      title: notificationForm.title,
      description: notificationForm.description,
      signal_ids: notificationForm.signal_ids,
    })
      .then(data => {
        notification.success({
          message: 'Gửi thông báo thành công!',
        });
      })
      .catch(error => {
        notification.error({
          message: 'Có lỗi xảy ra, gửi thông báo thất bại!',
        });
      })
      .finally(() => {
        setNotificationForm({
          ...notificationForm,
          loading: false,
        });
        setNotificationModalOpen(false);
      });
  };

  return (
    <div className="aaa">
      <div style={{ textAlign: 'center' }}>
        <Typography.Title level={2}>Khuyến nghị</Typography.Title>
      </div>
      <div>
        <Row>
          <Col>
            <Typography style={{ marginBottom: 3, marginTop: 10 }}>Gói dịch vụ</Typography>
            <Select
              style={{ width: 300 }}
              placeholder={'Chọn gói dịch vụ'}
              mode="multiple"
              onChange={value => {}}
              options={[...subscriptions?.map((item: any) => ({ label: item.name, value: item.id }))]}
            />
          </Col>
        </Row>
        <Row gutter={[10, 10]} align={'middle'} style={{ marginBottom: 10 }}>
          <Col>
            <Typography style={{ marginBottom: 3, marginTop: 10 }}>Ngày tạo</Typography>
            <RangePicker
              style={{
                width: '300px',
                marginBottom: 3,
              }}
              onChange={(value: any) => {
                console.log(value);

                if (value?.length > 0) {
                  setCreateDateFilter({
                    start_date: moment(value[0].$d).format('MM/DD/YYYY'),
                    end_date: moment(value[1].$d).format('MM/DD/YYYY'),
                  });
                } else {
                  setCreateDateFilter({
                    start_date: '',
                    end_date: '',
                  });
                }
              }}
            />
          </Col>
          <Col>
            <Typography style={{ marginBottom: 3, marginTop: 10 }}>Loại</Typography>
            <Select
              defaultValue="Tất cả"
              style={{ width: 120 }}
              onChange={(value: any) => {
                setTypeFilter(value);
              }}
              options={[
                { value: 0, label: 'Tất cả' },
                { value: 1, label: 'Ngắn hạn' },
                { value: 2, label: 'Dài hạn' },
              ]}
            />
          </Col>
          <Col>
            <Typography style={{ marginBottom: 3, marginTop: 10 }}>Tình trạng</Typography>
            <Select
              defaultValue="Tất cả"
              style={{ width: 120 }}
              onChange={(value: any) => {
                setStatusFilter(value);
              }}
              options={[
                { value: 'all', label: 'Tất cả' },
                { value: 'new', label: 'Mới' },
                { value: 'open', label: 'Đang mở' },
                { value: 'closed', label: 'Đã đóng' },
              ]}
            />
          </Col>
          {statusFilter == 'closed' && (
            <Col>
              <Typography style={{ marginBottom: 3, marginTop: 10 }}>Ngày đóng</Typography>
              <RangePicker
                style={{
                  width: '300px',
                  marginBottom: 3,
                }}
                onChange={(value: any) => {
                  console.log(value);

                  if (value?.length > 0) {
                    setClosedDateFilter({
                      start_date: moment(value[0].$d).format('MM/DD/YYYY'),
                      end_date: moment(value[1].$d).format('MM/DD/YYYY'),
                    });
                  } else {
                    setClosedDateFilter({
                      start_date: '',
                      end_date: '',
                    });
                  }
                }}
              />
            </Col>
          )}
        </Row>
        <Row gutter={[20, 20]}>
          <Col>
            <Typography style={{ marginBottom: 3, marginTop: 10 }}>Giá mua</Typography>
            <Slider
              range
              defaultValue={[0, 150]}
              step={0.01}
              min={1}
              max={150}
              style={{ width: 300 }}
              onChange={value => {
                setPriceRangeFilter(value);
              }}
            />
          </Col>

          <Col>
            <Typography style={{ marginBottom: 3, marginTop: 10 }}>Giá cắt lỗ</Typography>
            <Slider
              range
              defaultValue={[0, 150]}
              step={0.01}
              min={1}
              max={150}
              style={{ width: 300 }}
              onChange={value => {
                setStoplossPriceRangeFilter(value);
              }}
            />
          </Col>
          {statusFilter == 'closed' && (
            <Col>
              <Typography style={{ marginBottom: 3, marginTop: 10 }}>Giá đóng</Typography>
              <Slider
                range
                defaultValue={[0, 150]}
                step={0.01}
                min={1}
                max={150}
                style={{ width: 300 }}
                onChange={value => {
                  setClosedPriceRangeFilter(value);
                }}
              />
            </Col>
          )}
        </Row>
        <Row gutter={[20, 20]}>
          <Col>
            <Typography style={{ marginBottom: 3, marginTop: 10 }}>Giá chốt lời 1</Typography>
            <Slider
              range
              defaultValue={[0, 150]}
              step={0.01}
              min={1}
              max={150}
              style={{ width: 300 }}
              onChange={value => {
                setTargetSellPrice1RangeFilter(value);
              }}
            />
          </Col>
          <Col>
            <Typography style={{ marginBottom: 3, marginTop: 10 }}>Giá chốt lời 2</Typography>
            <Slider
              range
              defaultValue={[0, 150]}
              step={0.01}
              min={1}
              max={150}
              style={{ width: 300 }}
              onChange={value => {
                setTargetSellPrice2RangeFilter(value);
              }}
            />
          </Col>
          <Col>
            <Typography style={{ marginBottom: 3, marginTop: 10 }}>Giá chốt lời 3</Typography>
            <Slider
              range
              defaultValue={[0, 150]}
              step={0.01}
              min={1}
              max={150}
              style={{ width: 300 }}
              onChange={value => {
                setTargetSellPrice3RangeFilter(value);
              }}
            />
          </Col>
        </Row>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Col style={{ marginBottom: 10 }}>
            <Button type="primary" onClick={() => onFilter()}>
              {'Lọc'}
            </Button>
          </Col>
          <div>
            {selectedRow.length > 0 && (
              <>
                <Button
                  type="primary"
                  danger
                  onClick={() => {
                    setConfirmDeleteModalOpen(true);
                  }}
                >
                  Xóa
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    setNotificationModalOpen(true);
                    setNotificationForm({
                      ...notificationForm,
                      signal_ids: selectedRow,
                    });
                  }}
                >
                  Gửi thông báo
                </Button>
              </>
            )}
            {/* <Button
                            type="primary"
                            onClick={() => {
                                setNotificationModalOpen(true)
                                setNotificationForm({
                                    ...notificationForm,
                                    signal_ids: selectedRow
                                })
                            }}
                        >
                            Thêm khuyến nghị mới
                        </Button> */}
          </div>
        </div>
      </div>
      <Table
        columns={columns}
        rowKey={record => record.id}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
        scroll={{ x: 'max-content', y: '100%' }}
        rowSelection={{
          type: 'checkbox',
          onChange: (value: any) => {
            console.log(value);
            setSelectedRow(value);
          },
        }}
      />
      <ConfirmDeleteModal
        open={confirmDeleteModalOpen}
        handleOk={handleDeleteMany}
        handleCancel={() => setConfirmDeleteModalOpen(false)}
      />
      <SendSignalNotificationModal
        open={notificationModalOpen}
        handleOk={() => {
          handlesendSinalNotification();
        }}
        form={notificationForm}
        setForm={setNotificationForm}
        handleCancel={() => setNotificationModalOpen(false)}
      />
      {/* <CreateSignalModal/> */}
    </div>
  );
};

export default Recommendations;
