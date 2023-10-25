import type { SignalModel } from '@/interface/signal';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue } from 'antd/es/table/interface';

import { MenuOutlined, StarFilled } from '@ant-design/icons';
import { Button, Col, DatePicker, Dropdown, InputNumber, notification, Radio, Row, Table, Tag, Typography } from 'antd';
import moment from 'moment';
import qs from 'qs';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { closeSignal, deleteManySignal, getSignalList, sendManySignal, sendSignalNotification } from '@/api/signal';
import ClosedSignalModal from '@/components/modal/Signal/ClosedSignalModal';
import ConfirmDeleteModal from '@/components/modal/Signal/ConfirmDeleteModal';
import SendSignalNotificationModal from '@/components/modal/Signal/SendNotificationModal';
import SendSignalModal from '@/components/modal/Signal/SendSignalModal';
import ExportExcel from '@/pages/components/button-export-excel/ExportExcel';

import { getColumnSearchProps } from '../../Signal/ApproveAndCreateSignal';

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}
const { RangePicker } = DatePicker;

const Recommendations: React.FC = () => {
  const [count, setCount] = useState();

  const [data, setData] = useState<any>([]);
  const [dataExcel, setDataExcel] = useState([]);

  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>([]);
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

  const [closeSignalModal, setCloseSignalModal] = useState<{ open: boolean; data: any }>({
    open: false,
    data: {
      id: '',
      closed_price: 0,
      closed_reason: '',
      loading: false,
    },
  });

  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      pageSizeOptions: [10, 20, 50],
    },
  });
  const [sendSignalModal, setSendSignalModal] = useState<{ open: boolean; data: any }>({
    open: false,
    data: {} as any,
  });
  const [createDateFilter, setCreateDateFilter] = useState({
    start_date: '',
    end_date: '',
  });
  const [closedDateFilter, setClosedDateFilter] = useState({
    start_date: '',
    end_date: '',
  });
  const [priceRangeFilter, setPriceRangeFilter] = useState({
    from: null,
    to: null,
  });

  //enum true: dài hạn,false: ngắn hạn
  const [typeFilter, setTypeFilter] = useState(null);
  //enum ['closed', 'new', 'open']
  const [statusFilter, setStatusFilter] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState(null);
  const [codeFilter, setCodeFilter] = useState<string>('');
  const [dateSort, setDateSort] = useState('');
  const [selectedDates, setSelectedDates] = useState(null);

  const [filterQuery, setFilterQuery] = useState('');

  const [sortedInfo, setSortedInfo] = useState('');

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
      query += '&is_closed=false';
    }

    if (priceRangeFilter.from && priceRangeFilter.to) {
      query += '&target_buy_price_min=' + priceRangeFilter.from + '&target_buy_price_max=' + priceRangeFilter.to;
    }

    // cái này để mỗi lần nhất lọc đều triger function
    query += '&rd=' + Math.random().toString();
    setFilterQuery(query);
  };

  const actions = (record: any) => {
    const actionList = [];

    if (record.is_approved && !record.is_closed) {
      actionList.push({
        key: '5',
        label: (
          <Typography
            onClick={() => {
              console.log(record);
              setCloseSignalModal({
                open: true,
                data: {
                  ...closeSignalModal.data,
                  id: record.id,
                },
              });
            }}
          >
            {'Đóng'}
          </Typography>
        ),
        danger: true,
      });
    }

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

    // actionList.push({
    //     key: '54',
    //     label: <Typography onClick={() => {
    //         console.log(record.id)
    //         setNotificationModalOpen(true)
    //         setNotificationForm({
    //             ...notificationForm,
    //             signal_id: record.id
    //         })
    //     }}>{'Cập nhật ghi chú'}</Typography>,
    // });
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

  const columns: ColumnsType<any> = [
    {
      title: 'Ngày tạo',
      dataIndex: 'action_date',
      width: '8%',
      // sorter: () => {
      //   if (dateSort == 'DESC') {
      //     setDateSort('ASC');
      //   } else {
      //     setDateSort('DESC');
      //   }

      //   return 1;
      // },
      // sortDirections: ['ascend', 'descend'],
      sorter: true,
      render: (_, record) => <Typography.Text>{record?.action_date}</Typography.Text>,
    },
    {
      title: 'Mã CK',
      dataIndex: 'code',
      width: '8%',
      ...getColumnSearchProps({
        setFilter: setCodeFilter,
      }),
      // sorter: (a: any, b: any) => a.code.localeCompare(b.code),
      // sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: 'Loại',
      dataIndex: 'long_term',
      width: '5%',
      // render: (is_long_term: boolean) => {
      //   if (is_long_term) {
      //     return 'Dài hạn';
      //   } else {
      //     return 'Ngắn hạn';
      //   }
      // },
    },
    {
      title: 'Giá mua',
      dataIndex: 'target_buy_price',
      width: '8%',
    },
    {
      title: 'Giá chốt lời 1',
      dataIndex: 'target_sell_price_1',
      width: '6%',
    },
    {
      title: 'Giá chốt lời 2',
      dataIndex: 'target_sell_price_2',
      width: '6%',
    },
    {
      title: 'Giá chốt lời 3',
      dataIndex: 'target_sell_price_3',
      width: '6%',
    },
    {
      title: 'Giá cắt lỗ',
      dataIndex: 'target_stop_loss',
      width: '6%',
    },
    {
      title: 'Giá hiện tại',
      dataIndex: 'current_value',
      width: '6%',
      render: (_, record) => {
        if (record?.is_closed) {
          return <Tag color="red">Đóng</Tag>;
        } else {
          return <Typography.Text>{record?.current_value}</Typography.Text>;
        }
      },
      sorter: true,
    },
    {
      title: 'Giá đóng',
      dataIndex: 'current_value',
      width: '6%',
      render: (_, record) => {
        if (record?.is_closed) {
          return <Tag color="red">Đóng</Tag>;
        } else {
          return <Typography.Text>{record?.current_value}</Typography.Text>;
        }
      },
      sorter: true,
    },
    {
      title: 'Lợi nhuận hiện tại',
      dataIndex: 'current_profit',
      width: '8%',
      sorter: true,

      render: (_, record) => {
        if (record?.is_closed) {
          return <Tag color="red">Đóng</Tag>;
        } else {
          return (
            <Tag color={record?.current_profit >= 0 ? '#3b5999' : '#f03838'}>{record?.current_profit?.toFixed(2)}</Tag>
          );
        }
      },
    },
    {
      title: 'Lợi nhuận (%)',
      dataIndex: 'target_take_profit',
      width: '8%',
      sorter: true,


      
      render: (_, record) => {
        if (record?.is_closed) {
          return <Tag color="red">Đóng</Tag>;
        } else {
          return (
            <Tag color={record?.target_take_profit >= 0 ? '#3b5999' : '#f03838'}>{record?.target_take_profit}</Tag>
          );
        }
      },
    },

    {
      title: 'Ngày đóng',
      dataIndex: 'closed_date',
      width: '8%',
      // render: (_, record) => <Typography.Text>{record?.closed_date ? record?.closed_date : 'Abc'}</Typography.Text>,
    },
    {
      title: 'Lợi nhuận khi đóng',
      dataIndex: 'closed_profit',
      width: '10%',
      sorter: true,

      render: (_, record) => {
        return (
          <Tag color={record?.closed_profit >= 0 ? '#3b5999' : '#f03838'}>{record?.closed_profit?.toFixed(2)}</Tag>
        );
      },
    },
    {
      title: 'Lợi nhuận (%)',
      dataIndex: 'closed_profit_percentage',
      width: '10%',
      sorter: true,

      render: (_, record) => {
        return (
          <Tag color={record?.closed_profit_percentage >= 0 ? '#3b5999' : '#f03838'}>
            {record?.closed_profit_percentage?.toFixed(1)}
          </Tag>
        );
      },
    },
    {
      title: 'Ưu tiên',
      dataIndex: 'priority',
      width: '5%',
      sortDirections: ['ascend', 'descend', 'ascend'],
      render: data => (
        <div style={{ width: '30px' }}>
          <StarFilled style={data ? { color: '#eb8f19' } : {}} size={20} />
        </div>
      ),
    },
    {
      title: 'Tình trạng',
      dataIndex: 'status',
      width: '5%',
      render: (_, record: any) => (
        <>
          {record?.is_closed ? (
            <Tag color="red">Đóng</Tag>
          ) : record.is_approved ? (
            <Tag color="geekblue">Đang mở</Tag>
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
    await getSignalList(qs.stringify(getRandomuserParams(tableParams)), codeFilter, filterQuery, sortedInfo)
      .then(data => {
        if (data.code === 200) {
          setTableParams({
            ...tableParams,
            pagination: {
              ...tableParams.pagination,
              total: data?.data?.count,
            },
          });
          // console.log(data.data);
          const columns = data?.data?.rows?.map((item: any) => {
            const column = {
              ...item,
              date: item?.action_date,
              long_term: item?.is_long_term ? 'Dài hạn' : 'Ngắn hạn',
              status: item?.is_closed ? 'Đóng' : item?.is_approved ? 'Đã duyệt' : 'Mới',
            };

            return column;
          });

          setCount(data?.data?.count);
          setData(columns);
        }
      })
      .catch(error => {
        console.log(error);
      });

    setLoading(false);
  };

  const getSignalDataExcel = async (limit: string) => {
    setLoading(true);
    await getSignalList(`page=1&size=${limit}`, codeFilter, filterQuery, sortedInfo)
      .then(data => {
        if (data.code === 200) {
          const columns = data?.data?.rows?.map((item: any) => {
            const column = {
              ...item,
              date: item?.action_date,
              long_term: item?.is_long_term ? 'Dài hạn' : 'Ngắn hạn',
              status: item?.is_closed ? 'Đóng' : item?.is_approved ? 'Đã duyệt' : 'Mới',
            };

            return column;
          });

          setDataExcel(columns);
        }
      })
      .catch(error => {
        console.log(error);
      });

    setLoading(false);
  };

  useEffect(() => {
    if (statusFilter != null || typeFilter != null) {
      let query = '';

      if (typeFilter == 1) {
        query += '&is_long_term=false';
      } else if (typeFilter == 2) {
        query += '&is_long_term=true';
      }
      //////////////////

      if (statusFilter == 'closed') {
        query += '&is_closed=true';

        if (priorityFilter == true || priorityFilter == false) {
          query += `&priority=${priorityFilter}`;
        }
      } else if (statusFilter == 'new') {
        query += '&is_approve=false';
      } else if (statusFilter == 'open') {
        query += '&is_closed=false';
      }

      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          current: 1,
        },
      });
      setFilterQuery(query);
    }
  }, [statusFilter, typeFilter, priorityFilter]);

  useEffect(() => {
    getSignal();
  }, [JSON.stringify(tableParams), filterQuery, codeFilter, sortedInfo]);

  useEffect(() => {
    if (count) getSignalDataExcel(count);
  }, [count]);

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    console.log('sorter_________________', sorter);
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

      console.log('sorte asc_____________________', sorte);
      setSortedInfo(sorte);
    } else if (sorter.order === 'descend') {
      const sorte = `${sorter.field}_order=DESC`;

      console.log('sorte desc_____________________', sorte);

      setSortedInfo(sorte);
    }
  };

  const getRandomuserParams = (params: TableParams) => ({
    size: params.pagination?.pageSize,
    page: params.pagination?.current,
    // market: params.filters?.market,
    // code: searchText || undefined,
  });

  const handleDeleteMany = async () => {
    await deleteManySignal(selectedRow)
      .then((res: any) => {
        console.log(res);

        if (res.code == 200) {
          notification.success({ message: 'Xóa thành công !' });
          const new_data = [...data].filter((item: any) => !selectedRow.includes(item.id));

          setData(new_data);
          setSelectedRow([]);
        }
      })
      .catch(error => {
        console.log(error.response);
        notification.error({ message: error.message });
      })
      .finally(() => {
        setConfirmDeleteModalOpen(false);
      });
  };

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

  const handleSendManySignal = async (target: any) => {
    await sendManySignal({
      signal_ids: selectedRow || [],
      target: target,
    })
      .then(res => {
        console.log('res: ', res);
        notification.success({
          message: 'Gửi thành công',
        });
        setSendSignalModal({
          open: false,
          data: null,
        });
      })
      .catch(err => {
        console.log(err);
        notification.error({
          message: err.message,
        });
      });
  };

  const handleClosedSignal = async () => {
    if (loading) return;
    setLoading(true);

    if (closeSignalModal.data.closed_price == 0) {
      return notification.error({
        message: 'Giá đóng phải lớn hơn 0',
      });
    } else {
      await closeSignal(closeSignalModal.data)
        .then((res: any) => {
          console.log('closed signal : ', res);

          if (res.code == 200) {
            notification.success({
              message: 'Đóng khuyến nghị thành công',
            });

            const new_data = [...data].map((item: SignalModel) => {
              if (item.id == res.data.id) {
                return {
                  ...item,
                  closed_date: moment().format('DD/MM/YYYY'),
                  is_closed: true,
                  closed_price: res.data.closed_price,
                };
              }

              return item;
            });

            setData(new_data);
            setCloseSignalModal({
              open: false,
              data: {
                id: '',
                closed_price: 0,
                closed_reason: '',
                loading: false,
              },
            });
          }
        })
        .catch(err => {
          notification.error({
            message: err.message,
          });
        });
    }

    setLoading(false);
  };

  const handelResetFilter = () => {
    setSortedInfo('');

    setFilterQuery('');
    setCodeFilter('');
    setTypeFilter(null);
    setStatusFilter(null);
    setSelectedDates(null);
    setDateSort('DESC');
    setPriceRangeFilter({
      from: null,
      to: null,
    });
    setCreateDateFilter({
      end_date: '',
      start_date: '',
    });
    setTableParams({
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: [10, 20, 50],
      },
    });
  };

  // console.log('dât____________________', data);
  // console.log('dateSort_____________', dateSort);
  // console.log('table param__________________', tableParams);

  // console.log('getRandomuserParams_____________', getRandomuserParams(tableParams));
  return (
    <div className="aaa">
      <div style={{ textAlign: 'center' }}>
        <Typography.Title level={2}>Khuyến nghị</Typography.Title>
      </div>
      <div>
        <div
          // className="mb-[20px]"
          style={{ marginBottom: '20px' }}
        >
          <Row gutter={10}>
            <Col xs={24} md={12} lg={12} xl={8}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography className="me-[10px]" style={{ marginInlineEnd: '10px' }}>
                  Loại:{' '}
                </Typography>
                <Radio.Group value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                  <Radio.Button value={null}>Tất cả</Radio.Button>
                  <Radio.Button value={1}>Ngắn hạn</Radio.Button>
                  <Radio.Button value={2}>Dài hạn</Radio.Button>
                </Radio.Group>
              </div>
            </Col>
            <Col xs={24} md={12} lg={12} xl={8}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography className="me-[10px]" style={{ marginInlineEnd: '10px' }}>
                  Tình trạng:
                </Typography>
                <Radio.Group value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  <Radio.Button value={null}>Tất cả</Radio.Button>
                  <Radio.Button value={'open'}>Đang mở</Radio.Button>
                  <Radio.Button value={'closed'}>Đã đóng</Radio.Button>
                </Radio.Group>
              </div>
            </Col>
            {statusFilter == 'closed' && (
              <Col xs={24} md={12} lg={12} xl={8}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography className="me-[10px]" style={{ marginInlineEnd: '10px' }}>
                    Độ ưu tiên:
                  </Typography>
                  <Radio.Group defaultValue={''} onChange={e => setPriorityFilter(e.target.value)}>
                    <Radio.Button value={''}>Tất cả</Radio.Button>
                    <Radio.Button value={true}>Ưu tiên</Radio.Button>
                    <Radio.Button value={false}>Không ưu tiên</Radio.Button>
                  </Radio.Group>
                </div>
              </Col>
            )}
          </Row>
          <div
            className="items-center mt-[15px] 
                        gap-5 border-[1px] w-fit 
                        px-[10px] py-[10px] rounded-[6px] border-[#ccc] relative"
            style={{
              alignItems: 'center',
              gap: '5px',
              width: 'fit-content',
              padding: '10px',
              borderRadius: '10px',
              border: '1px solid #ccc',
              position: 'relative',
              marginTop: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
              <Typography style={{ marginInlineEnd: '10px' }}>Ngày tạo: </Typography>
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
                    setSelectedDates(value);
                  } else {
                    setCreateDateFilter({
                      start_date: '',
                      end_date: '',
                    });
                  }
                }}
                value={selectedDates}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
              <Typography>Giá mua : Từ</Typography>
              <InputNumber
                className="mx-[7px]"
                onChange={(value: any) => {
                  setPriceRangeFilter({
                    ...priceRangeFilter,
                    from: value,
                  });
                }}
                style={{ margin: '0 7px' }}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                min={0}
                value={priceRangeFilter.from}
              />
              <Typography> Đến </Typography>
              <InputNumber
                className="mx-[7px]"
                style={{ margin: '0 7px' }}
                onChange={(value: any) => {
                  setPriceRangeFilter({
                    ...priceRangeFilter,
                    to: value,
                  });
                }}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                min={0}
                value={priceRangeFilter.to}
              />
            </div>

            <div style={{ display: 'flex', marginTop: '10px' }}>
              <Button className="" onClick={onFilter}>
                <Typography>Lọc</Typography>
              </Button>
              {<Button onClick={handelResetFilter}>Reset bộ lọc</Button>}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
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
                  onClick={() => {
                    setNotificationModalOpen(true);
                    setNotificationForm({
                      ...notificationForm,
                      signal_ids: selectedRow,
                    });
                  }}
                >
                  <Typography>Gửi thông báo</Typography>
                </Button>
                <Button
                  onClick={() => {
                    setSendSignalModal({
                      open: true,
                      data: {
                        signal_ids: selectedRow,
                      },
                    });
                  }}
                >
                  <Typography>Gửi Khuyến nghị</Typography>
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <Typography>
          Có tất cả <Typography.Text strong>{count}</Typography.Text> kết quả
        </Typography>
        <ExportExcel columns={columns} dataSource={dataExcel} title="Danh sách khuyến nghị" />
      </div>
      <Table
        columns={columns}
        rowKey={record => record.id}
        dataSource={data}
        pagination={tableParams.pagination}
        // loading={loading}
        onChange={handleTableChange}
        scroll={{ x: 'max-content', y: '100%' }}
        rowSelection={{
          type: 'checkbox',
          onChange: (value: any) => {
            console.log(value);
            setSelectedRow(value);
          },
        }}
        expandable={{
          expandedRowRender: record => {
            console.log(record);

            return (
              <div
                //  className="text-left"
                style={{ textAlign: 'left' }}
              >
                <div>
                  <Typography style={{ margin: 0 }}>Mô tả : {record?.description}</Typography>
                </div>
                <div>
                  <Typography style={{ margin: 0 }}>Ghi chú : {record?.note}</Typography>
                </div>
              </div>
            );
          },
        }}
        style={{ height: 'auto' }}
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
      <ClosedSignalModal
        open={closeSignalModal.open}
        handleOk={() => {
          handleClosedSignal();
        }}
        loading={loading}
        data={closeSignalModal}
        setData={setCloseSignalModal}
        handleCancel={() =>
          setCloseSignalModal({
            ...closeSignalModal,
            open: false,
          })
        }
      />
      <SendSignalModal
        open={sendSignalModal.open}
        handleOk={handleSendManySignal}
        handleCancel={() => {
          setSendSignalModal({
            ...sendSignalModal,
            open: false,
          });
        }}
      />
    </div>
  );
};

export default Recommendations;
