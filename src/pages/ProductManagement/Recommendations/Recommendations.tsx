import type { SignalModel } from '@/interface/signal';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';

import { BorderOuterOutlined, MenuOutlined, StarFilled, UploadOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Dropdown,
  InputNumber,
  notification,
  Popconfirm,
  Radio,
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

import {
  approveManySignal,
  closeSignal,
  deleteManySignal,
  getSignalList,
  sendManySignal,
  sendSignalNotification,
} from '@/api/signal';
import MyButton from '@/components/basic/button';
import MyModal from '@/components/basic/modal';
import ClosedSignalModal from '@/components/modal/Signal/ClosedSignalModal';
import ConfirmDeleteModal from '@/components/modal/Signal/ConfirmDeleteModal';
import SendSignalNotificationModal from '@/components/modal/Signal/SendNotificationModal';
import CreateSignalModal from '@/components/modal/Signal/SendSignalModal';
import SendSignalModal from '@/components/modal/Signal/SendSignalModal';

import { getColumnSearchProps } from '../../Signal/ApproveAndCreateSignal';

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
  const [data, setData] = useState<any>([]);
  const subscriptions = useSelector(state => state.subsciptions.subscriptions);
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
  const [noteForm, setNoteForm] = useState({
    note: '',
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
  const [dateSort, setDateSort] = useState('DESC');

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
      title: 'Ngày tạo',
      dataIndex: 'action_date',
      width: '10%',
      sorter: () => {
        if (dateSort == 'DESC') {
          setDateSort('ASC');
        } else {
          setDateSort('DESC');
        }

        return 1;
      },
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Mã CK',
      dataIndex: 'code',
      width: '5%',
      ...getColumnSearchProps({
        setFilter: setCodeFilter,
      }),
      // sorter: (a: any, b: any) => a.code.localeCompare(b.code),
      // sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: 'Loại',
      dataIndex: 'is_long_term',
      width: '8%',
      render: (is_long_term: boolean) => {
        if (is_long_term) {
          return 'Dài hạn';
        } else {
          return 'Ngắn hạn';
        }
      },
    },
    {
      title: 'Giá mua',
      dataIndex: 'target_buy_price',
      width: '8%',
    },
    {
      title: 'Giá chốt lời 1',
      dataIndex: 'target_sell_price_1',
      width: '8%',
    },
    {
      title: 'Giá chốt lời 2',
      dataIndex: 'target_sell_price_2',
      width: '8%',
    },
    {
      title: 'Giá chốt lời 3',
      dataIndex: 'target_sell_price_3',
      width: '10%',
    },
    {
      title: 'Giá cắt lỗ',
      dataIndex: 'target_stop_loss',
      width: '10%',
    },
    {
      title: 'Giá đóng',
      dataIndex: 'closed_price',
      width: '10%',
    },

    {
      title: 'Ngày đóng',
      dataIndex: 'closed_date',
      width: '12%',
      sorter: (a: any, b: any) => a.closed_date.localeCompare(b.closed_date),
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: 'Ưu tiên',
      dataIndex: 'priority',
      width: '5%',
      sortDirections: ['ascend', 'descend', 'ascend'],
      render: data => (
        <div>
          <StarFilled style={data ? { color: '#eb8f19' } : {}} size={20} />
        </div>
      ),
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
    await getSignalList(tableParams.pagination, codeFilter, filterQuery, dateSort)
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
        query += '&is_approve=true';
      }
      setTableParams({
        ...tableParams,
        pagination:{
          ...tableParams.pagination,
          current: 1
        }
      });
      setFilterQuery(query);
    }
  }, [statusFilter, typeFilter, priorityFilter]);
  useEffect(() => {
    getSignal();
  }, [JSON.stringify(tableParams), filterQuery, codeFilter, dateSort]);

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
  };

  return (
    <div className="aaa">
      <div style={{ textAlign: 'center' }}>
        <Typography.Title level={2}>Khuyến nghị</Typography.Title>
      </div>
      <div>
        <div className="mb-[20px]">
          <Row gutter={10}>
            <Col xs={24} md={12} lg={12} xl={8}>
              <div className="flex items-center">
                <Typography className="me-[10px]">Loại</Typography>
                <Radio.Group defaultValue={''} onChange={e => setTypeFilter(e.target.value)}>
                  <Radio.Button value={''}>Tất cả</Radio.Button>
                  <Radio.Button value={1}>Ngắn hạn</Radio.Button>
                  <Radio.Button value={2}>Dài hạn</Radio.Button>
                </Radio.Group>
              </div>
            </Col>
            <Col xs={24} md={12} lg={12} xl={8}>
              <div className="flex items-center">
                <Typography className="me-[10px]">Tình trạng</Typography>
                <Radio.Group defaultValue={''} onChange={e => setStatusFilter(e.target.value)}>
                  <Radio.Button value={''}>Tất cả</Radio.Button>
                  <Radio.Button value={'open'}>Đang mở</Radio.Button>
                  <Radio.Button value={'closed'}>Đã đóng</Radio.Button>
                </Radio.Group>
              </div>
            </Col>
            {statusFilter == 'closed' && (
              <Col xs={24} md={12} lg={12} xl={8}>
                <div className="flex items-center">
                  <Typography className="me-[10px]">Độ ưu tiên</Typography>
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
          >
            <div className="flex items-center  mt-[10px]">
              <Typography className="me-[10px]">Ngày tạo</Typography>
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
            </div>
            <div className="flex items-center mt-[10px]">
              <Typography>Giá mua : Từ</Typography>
              <InputNumber
                className="mx-[7px]"
                onChange={(value: any) => {
                  setPriceRangeFilter({
                    ...priceRangeFilter,
                    from: value,
                  });
                }}
              />
              <Typography> Đến </Typography>
              <InputNumber
                className="mx-[7px]"
                onChange={(value: any) => {
                  setPriceRangeFilter({
                    ...priceRangeFilter,
                    to: value,
                  });
                }}
              />
            </div>

            <div className="flex mt-[10px]">
              <Button className="" onClick={onFilter}>
                <Typography>Lọc</Typography>
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-between mb-4">
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
        expandable={{
          expandedRowRender: record => {
            console.log(record);

            return (
              <div className="text-left">
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
