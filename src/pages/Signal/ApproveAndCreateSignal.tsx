import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue } from 'antd/es/table/interface';

import './index.less';

import { MenuOutlined, SearchOutlined,StarOutlined,StarFilled } from '@ant-design/icons';
import {
  Button,
  Col,
  DatePicker,
  Dropdown,
  Input,
  InputNumber,
  notification,
  Radio,
  Row,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';

const { RangePicker } = DatePicker;

import type { SignalModel } from '@/interface/signal';

import moment from 'moment';

import {
  approveManySignal,
  createSignal,
  deleteSignal,
  getSignalList,
  sendSignalNotification,
  updateSignal,
} from '@/api/signal';
import CreateSingalDrawer from '@/components/drawer/CreateSingalDrawer';
import UpdateSingalDrawer from '@/components/drawer/UpdateSignalDrawer';
import ConfirmDeleteModal from '@/components/modal/Signal/ConfirmDeleteModal';
import SendSignalNotificationModal from '@/components/modal/Signal/SendNotificationModal';

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}

export const getColumnSearchProps = ({ setFilter }: any) => {
  const [value, setValue] = useState('');

  return {
    filterDropdown: () => (
      <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
        <Input
          placeholder={`Search name`}
          value={value}
          onChange={e => {
            setValue(e.target.value);
          }}
          onPressEnter={() => {
            console.log(value);
            setFilter(value);
          }}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => {
              setFilter(value);
            }}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              setFilter('');
              setValue('');
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
  };
};

const Recommendations: React.FC = () => {
  const [data, setData] = useState<any>([]);
  const [count, setCount] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>([]);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [openUpdateDrawer, setOpenUpdateDrawer] = useState<boolean>(false);
  const [updateData, setUpdateData] = useState<any>();

  // filter state
  const [codeFilter, setCodeFilter] = useState<string>('');
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
  //enum 2: dài hạn,1: ngắn hạn
  const [typeFilter, setTypeFilter] = useState(null);
  //enum ['closed', 'new', 'open']
  const [statusFilter, setStatusFilter] = useState(null);

  const [filterQuery, setFilterQuery] = useState('');

  //sort state --------------------------->
  const [dateSort, setDateSort] = useState('DESC');

  const onFilter = () => {
    let query = '';

    if (createDateFilter.end_date || createDateFilter.start_date) {
      query += '&start_date=' + createDateFilter.start_date + '&end_date=' + createDateFilter.end_date;
    }

    if (closedDateFilter.end_date || closedDateFilter.start_date) {
      query += '&closed_date_start=' + closedDateFilter.start_date + '&closed_date_end=' + closedDateFilter.end_date;
    }

    if (typeFilter) {
      if (typeFilter == 1) {
        query += '&is_long_term=false';
      } else if (typeFilter == 2) {
        query += '&is_long_term=true';
      }
    }

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

    // if (statusFilter == 'closed') {
    //     query +=
    //         '&closed_price_min=' + closedPriceRangeFilter[0] + '&closed_price_max=' + closedPriceRangeFilter[1];
    // }
    // cái này để mỗi lần nhất lọc đều triger function
    query += '&rd=' + Math.random().toString();
    setFilterQuery(query);
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
      } else if (statusFilter == 'new') {
        query += '&is_approve=false';
      } else if (statusFilter == 'open') {
        query += '&is_approve=true';
      }

      setFilterQuery(query);
    }
  }, [statusFilter, typeFilter]);

  const actions = (record: any) => {
    const actionList = [];

    if (!record.is_approved) {
      actionList.push({
        key: '3',
        label: (
          <Typography
            onClick={() => {
              handleApproveSignal([record.id], true);
            }}
          >
            {'Duyệt'}
          </Typography>
        ),
      });
    }

    actionList.push({
      key: '2',
      label: (
        <Typography
          onClick={() => {
            setUpdateData(record);
            setOpenUpdateDrawer(true);
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
            handleDeleteSignal(record.id);
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
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: 'Ưu tiên',
      dataIndex: 'priority',
      width: '5%',
      sortDirections: ['ascend', 'descend', 'ascend'],
      render: (data) => (
        <div>
            <StarFilled style={data ? {color: '#eb8f19'}: {}} size={20}/>
        </div>
      )
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
          setCount(data?.data?.count);
        }
      })
      .catch(error => {
        console.log(error);
      });

    setLoading(false);
  };

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

  const checkIsNewSignal = () => {
    const filter = data.filter((item: any) => selectedRow.includes(item.id)) || [];

    console.log(filter);
    const bool = filter.every((item: any) => item.is_approved == false);

    console.log('check ', bool);

    return bool;
  };

  const handleDeleteSignal = (id: string) => {
    deleteSignal(id)
      .then(res => {
        console.log(res);
        const new_data = [...data].filter(item => item.id !== id);

        setData(new_data);
        notification.success({
          message: 'Xóa thành công',
        });
      })
      .catch(err => {
        notification.error({
          message: 'Có lỗi xảy ra!',
        });
      });
  };

  const handleCreateSignal = async (payload: any) => {
    return await createSignal({
      signal: payload,
    })
      .then((res: any) => {
        setData([
          {
            ...res?.data,
            code: payload.code,
            action_date: moment().format('DD/MM/YYYY'),
          },
          ...data,
        ]);
        notification.success({
          message: 'Tạo khuyến nghị thành công',
        });

        return true;
      })
      .catch(error => {
        console.log('create signal error: ', error);
        notification.error({
          message: 'Có lỗi xảy ra!',
        });

        return false;
      });
  };

  const handleUpdateSignal = async (payload: any) => {
    console.log(payload);

    return await updateSignal({
      ...payload,
      id: updateData.id,
    })
      .then((res: any) => {
        console.log(res);
        const new_data = [...data].map((item: SignalModel) => {
          if (item.id === res.id) {
            return {
              ...item,
              ...payload,
            };
          }

          return item;
        });

        setData(new_data);
        notification.success({
          message: 'Cập nhật khuyến nghị thành công',
        });

        return true;
      })
      .catch(error => {
        console.log('create signal error: ', error);
        notification.error({
          message: 'Có lỗi xảy ra!',
        });

        return false;
      });
  };

  const handleApproveSignal = async (signal_ids: any, approve: boolean) => {
    await approveManySignal({
      signal_ids: signal_ids || [],
      approve: approve,
    })
      .then(res => {
        console.log('res: ', res);
        const new_data = [...data];

        if (approve) {
          new_data.map((item: any) => {
            if (signal_ids.includes(item.id)) {
              item.is_approved = true;

              return item;
            }

            return item;
          });
          setData(new_data);
        } else {
          const filter = new_data.filter((item: any) => {
            console.log(item);

            return !signal_ids.includes(item.id);
          });

          setData(filter);
        }
      })
      .finally(() => {
        setSelectedRow([]);
      });
  };

  return (
    <div className="aaa">
      <div style={{ textAlign: 'center' }}>
        <Typography.Title level={2}>Duyệt/ Tạo Khuyến nghị</Typography.Title>
      </div>
      <div className="mb-[20px]">
        <Row>
          <Col xs={12} lg={6}>
            <div className="flex items-center">
              <Typography className="me-[10px]">Loại</Typography>
              <Radio.Group defaultValue={''} onChange={e => setTypeFilter(e.target.value)}>
                <Radio.Button value={''}>Tất cả</Radio.Button>
                <Radio.Button value={1}>Ngắn hạn</Radio.Button>
                <Radio.Button value={2}>Dài hạn</Radio.Button>
              </Radio.Group>
            </div>
          </Col>
          <Col xs={12} lg={12}>
            <div className="flex items-center">
              <Typography className="me-[10px]">Tình trạng</Typography>
              <Radio.Group defaultValue={''} onChange={e => setStatusFilter(e.target.value)}>
                <Radio.Button value={''}>Tất cả</Radio.Button>
                <Radio.Button value={'open'}>Đang mở</Radio.Button>
                <Radio.Button value={'closed'}>Đã đóng</Radio.Button>
              </Radio.Group>
            </div>
          </Col>
          <Col lg={6} xs={12} className="flex justify-end">
            <Button onClick={() => setOpenDrawer(true)}>Tạo mới</Button>
          </Col>
        </Row>
        <div>
          <div className="flex items-center mt-[15px]">
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
          <div className="flex items-center mt-[15px]">
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
          <div className="flex">
            {/* <Button className='mt-[10px]' onClick={()=>{
                            setPriceRangeFilter({
                                from: null,
                                to: null
                            })
                            setCreateDateFilter({
                                start_date: '',
                                end_date: ''
                            })
                            setTimeout(()=>{
                                onFilter()
                            },0)
                        }}>
                            <Typography>Reset</Typography>
                        </Button> */}
            <Button className="mt-[10px]" onClick={onFilter}>
              <Typography>Lọc</Typography>
            </Button>
          </div>
        </div>
      </div>
      <div>
        {selectedRow.length > 0 && checkIsNewSignal() && (
          <>
            <Button
              className="mb-[5px]"
              onClick={() => {
                handleApproveSignal(selectedRow, true);

                // setSendSignalModal({
                //     open: true,
                //     data: {
                //         signal_ids: selectedRow
                //     }
                // })
              }}
            >
              Duyệt khuyến nghị
            </Button>
            <Button
              className="mb-[5px]"
              onClick={() => {
                handleApproveSignal(selectedRow, false);
              }}
            >
              Từ chối khuyến nghị
            </Button>
          </>
        )}
      </div>
      <Typography>Có tất cả {count} kết quả</Typography>
      <Table
        columns={columns}
        rowKey={record => record.id}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
        scroll={{ x: 'max-content', y: '100%' }}
        expandable={{
          expandedRowRender: (record) => {
            console.log(record)
            return (
              <div className='text-left'>
                <div>
                  <Typography style={{ margin: 0 }}>
                    Mô tả : {record?.description}
                  </Typography>
                </div>
                <div>
                  <Typography style={{ margin: 0 }}>
                    Ghi chú : {record?.note}
                  </Typography>
                </div>
              </div>
            )
          },
        }}
        rowSelection={{
          type: 'checkbox',
          onChange: (value: any) => {
            console.log(value);
            setSelectedRow(value);
          },
        }}
      />
      <CreateSingalDrawer open={openDrawer} onClose={() => setOpenDrawer(false)} onSubmit={handleCreateSignal} />
      <UpdateSingalDrawer
        open={openUpdateDrawer}
        onClose={() => setOpenUpdateDrawer(false)}
        onSubmit={handleUpdateSignal}
        data={updateData}
      />
    </div>
  );
};

export default Recommendations;
