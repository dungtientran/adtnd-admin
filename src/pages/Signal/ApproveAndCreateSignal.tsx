import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue } from 'antd/es/table/interface';

import './index.less';

import { MenuOutlined, SearchOutlined, StarFilled, StarOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  DatePicker,
  Dropdown,
  Image,
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

import _debounce from 'lodash/debounce';
import moment from 'moment';
import qs from 'qs';

import {
  approveManySignal,
  createSignal,
  deleteSignal,
  getSignalList,
  getSignalListPageApprove,
  sendSignalNotification,
  updateSignal,
} from '@/api/signal';
import CreateSingalDrawer from '@/components/drawer/CreateSingalDrawer';
import UpdateSingalDrawer from '@/components/drawer/UpdateSignalDrawer';
import ConfirmDeleteModal from '@/components/modal/Signal/ConfirmDeleteModal';
import SendSignalNotificationModal from '@/components/modal/Signal/SendNotificationModal';

import ExportExcel from '../components/button-export-excel/ExportExcel';

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}

export const getColumnSearchProps = ({ setFilter }: any) => {
  const [value, setValue] = useState('');

  const handleInputChange = _debounce(e => {
    setFilter(e.target.value);
    setValue(e.target.value);
  }, 500);

  return {
    filterDropdown: () => (
      <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
        <Input
          placeholder={`Search name`}
          // value={value}
          onChange={handleInputChange}
          onPressEnter={() => {
            // console.log(value);
            setFilter(value);
          }}
          style={{ marginBottom: 8, display: 'block' }}
        />
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
  };
};

const Recommendations: React.FC = () => {
  const [data, setData] = useState<any>([]);
  const [dataExcel, setDataExcel] = useState([]);
  const [count, setCount] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>([]);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      pageSizeOptions: [10, 20, 50],
    },
  });
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [openUpdateDrawer, setOpenUpdateDrawer] = useState<boolean>(false);
  const [updateData, setUpdateData] = useState<any>();
  const [spining, setSpining] = useState<boolean>(false);

  // filter state
  const [codeFilter, setCodeFilter] = useState<string>('');
  const [selectedDates, setSelectedDates] = useState(null);
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
  const [typeFilter, setTypeFilter] = useState('');
  //enum ['closed', 'new', 'open']
  const [statusFilter, setStatusFilter] = useState('');

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
      if (typeFilter === '1') {
        query += '&is_long_term=false';
      } else if (typeFilter === '2') {
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
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: 1,
      },
    });
  };

  useEffect(() => {
    let query = '';

    if (typeFilter === '1') {
      query += '&is_long_term=false';
    } else if (typeFilter === '2') {
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

    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        current: 1,
      },
    });
    setFilterQuery(query);
  }, [statusFilter, typeFilter]);

  const actions = (record: any) => {
    const actionList = [];

    if (!record.is_approved) {
      actionList.push(
        {
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
        },

        {
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
        },
      );
    }

    // actionList.push({
    //   key: '2',
    //   label: (
    //     <Typography
    //       onClick={() => {
    //         setUpdateData(record);
    //         setOpenUpdateDrawer(true);
    //       }}
    //     >
    //       {'Sửa'}
    //     </Typography>
    //   ),
    // });
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
      dataIndex: 'date',
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
      width: '10%',
      ...getColumnSearchProps({
        setFilter: setCodeFilter,
      }),
      // sorter: (a: any, b: any) => a.code.localeCompare(b.code),
      // sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: 'Loại',
      dataIndex: 'is_long_term',
      width: '10%',
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
      width: '10%',
    },
    {
      title: 'Giá bán mục tiêu 1',
      dataIndex: 'target_sell_price_1',
      width: '10%',
    },
    {
      title: 'Giá bán mục tiêu 2',
      dataIndex: 'target_sell_price_2',
      width: '10%',
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
      render: (_, record) => {
        return <Tag color="red">{record?.target_stop_loss}</Tag>;
      },
    },
    // {
    //   title: 'Giá đóng',
    //   dataIndex: 'closed_price',
    //   width: '10%',
    // },

    // {
    //   title: 'Ngày đóng',
    //   dataIndex: 'closed_date',
    //   width: '12%',
    //   sortDirections: ['ascend', 'descend', 'ascend'],
    // },
    // {
    //   title: 'Ưu tiên',
    //   dataIndex: 'priority',
    //   width: '5%',
    //   sortDirections: ['ascend', 'descend', 'ascend'],
    //   render: data => (
    //     <div>
    //       <StarFilled style={data ? { color: '#eb8f19' } : {}} size={20} />
    //     </div>
    //   ),
    // },
    {
      title: 'Tình trạng',
      dataIndex: 'status',
      width: '10%',
      render: (_, record: any) => (
        // <{<Tag color="geekblue">Đã duyệt</Tag> : <Tag color="green">Mới</Tag>
        <Tag color={record?.status === 'Đã duyệt' ? 'geekblue' : 'green'}>{record?.status}</Tag>
      ),
    },
    actionsColumn,
  ];

  const getSignal = async () => {
    setLoading(true);
    await getSignalListPageApprove(qs.stringify(getRandomuserParams(tableParams)), codeFilter, filterQuery, dateSort)
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
              id: item?.id,
              date: moment(item?.created_at).format('YYYY/MM/DD'),
              code: item?.code,
              is_long_term: item?.is_long_term ? 'Dài hạn' : 'Ngắn hạn',
              target_buy_price: item?.target_buy_price,
              target_sell_price_1: item?.target_sell_price_1,
              target_sell_price_2: item?.target_sell_price_2,
              target_sell_price_3: item?.target_sell_price_3,
              target_stop_loss: item?.target_stop_loss,
              status: item?.is_approved ? 'Đã duyệt' : 'Mới',
              is_closed: item?.is_closed,
              is_approved: item?.is_approved,
              note: item?.note,
              description: item?.description,
              detail_chart: item?.detail_chart,
            };

            return column;
          });

          setData(columns);
          // setCount(data?.data?.count);
          getSignalDataExcel(data?.data?.count);
        }
      })
      .catch(error => {
        console.log(error);
      });

    setLoading(false);
  };

  const getSignalDataExcel = async (limit: string) => {
    setLoading(true);
    await getSignalListPageApprove(`page=1&size=${limit}`, codeFilter, filterQuery, dateSort)
      .then(data => {
        if (data.code === 200) {
          const columns = data?.data?.rows?.map((item: any) => {
            const column = {
              date: moment(item?.created_at).format('YYYY/MM/DD'),
              code: item?.code,
              is_long_term: item?.is_long_term ? 'Dài hạn' : 'Ngắn hạn',
              target_buy_price: item?.target_buy_price,
              target_sell_price_1: item?.target_sell_price_1,
              target_sell_price_2: item?.target_sell_price_2,
              target_sell_price_3: item?.target_sell_price_3,
              target_stop_loss: item?.target_stop_loss,
              status: item?.is_approved ? 'Đã duyệt' : 'Mới',
              is_closed: item?.is_closed,
              is_approved: item?.is_approved,
              note: item?.note,
              description: item?.description,
              detail_chart: item?.detail_chart,
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
    getSignal();
  }, [JSON.stringify(tableParams), filterQuery, codeFilter, dateSort]);

  // useEffect(() => {
  //   if (count) getSignalDataExcel(count);
  // }, [count]);

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    // console.log(pagination);
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  const getRandomuserParams = (params: TableParams) => ({
    size: params.pagination?.pageSize,
    page: params.pagination?.current,
  });

  const checkIsNewSignal = () => {
    const filter = data.filter((item: any) => selectedRow.includes(item.id)) || [];

    // console.log('data______________________', data);
    // console.log('checkIsNewSignal______________________', selectedRow);
    // console.log('filter______________________selectedRow', filter);

    const bool = filter.every((item: any) => item?.is_approved === false);

    // console.log('check______________________bool', bool);

    return bool;
  };

  // console.log("check_________selectrow", selectedRow.includes("7d92e2a2-9c2f-4436-a355-26993a564b7b"));
  const handleDeleteSignal = (id: string) => {
    if (loading) return;
    setLoading(true);
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
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCreateSignal = async (payload: any) => {
    setSpining(true);

    await createSignal({
      signal: payload,
    })
      .then((res: any) => {
        setSpining(true);
        notification.success({
          message: 'Tạo khuyến nghị thành công',
        });
        getSignal();
        setOpenDrawer(false);
        setSpining(false);

        return true;
      })
      .catch(error => {
        setSpining(false);
        console.log('create signal error: ', error);
        notification.error({
          message: 'Có lỗi xảy ra!',
        });

        return false;
      });
    setSpining(false);
  };

  const handleUpdateSignal = async (payload: any) => {
    // console.log(payload);
    // if (loading) return;
    // setLoading(true);
    setSpining(true);

    return await updateSignal({
      ...payload,
      id: updateData.id,
    })
      .then((res: any) => {
        // console.log(res);
        // const new_data = [...data].map((item: SignalModel) => {
        //   if (item.id === res.id) {
        //     return {
        //       ...item,
        //       ...payload,
        //     };
        //   }

        //   return item;
        // });

        // setData(new_data);
        getSignal();
        // getSignalDataExcel();
        setOpenUpdateDrawer(false);
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
      })
      .finally(() => {
        setLoading(false);
        setSpining(false);
      });
  };

  const handleApproveSignal = async (signal_ids: any, approve: boolean) => {
    if (loading) return;
    setLoading(true);
    await approveManySignal({
      signal_ids: signal_ids || [],
      approve: approve,
    })
      .then(res => {
        console.log('res: ', res);
        // const new_data = [...data];

        // if (approve) {
        //   new_data.map((item: any) => {
        //     if (signal_ids.includes(item.id)) {
        //       item.is_approved = true;

        //       return item;
        //     }

        //     return item;
        //   });
        //   setData(new_data);
        // } else {
        //   const filter = new_data.filter((item: any) => {
        //     console.log(item);

        //     return !signal_ids.includes(item.id);
        //   });

        //   setData(filter);
        // }
        getSignal();
        notification.success({
          message: `${approve ? 'Duyệt' : 'Từ chối'} thành công`,
        });
      })
      .catch(err => {
        notification.error({
          message: err.message,
        });
      })
      .finally(() => {
        setSelectedRow([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (loading) setDataExcel([]);
  }, [loading]);

  return (
    <div className="aaa">
      <div style={{ textAlign: 'center' }}>
        <Typography.Title level={2}>Duyệt/ Tạo Khuyến nghị</Typography.Title>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <Row>
          <Col xs={12} lg={8}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography className="me-[10px]" style={{ marginInlineEnd: '10px' }}>
                Loại:
              </Typography>
              <Radio.Group value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                <Radio.Button value={''}>Tất cả</Radio.Button>
                <Radio.Button value={'1'}>Ngắn hạn</Radio.Button>
                <Radio.Button value={'2'}>Dài hạn</Radio.Button>
              </Radio.Group>
            </div>
          </Col>

          <Col xs={12} lg={8}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography className="me-[10px]" style={{ marginInlineEnd: '10px' }}>
                Tình trạng:
              </Typography>
              <Radio.Group value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <Radio.Button value={''}>Tất cả</Radio.Button>
                <Radio.Button value={'new'}>Chưa duyệt </Radio.Button>
                <Radio.Button value={'open'}>Đã duyệt</Radio.Button>
                {/* <Radio.Button value={'closed'}>Đã đóng</Radio.Button> */}
              </Radio.Group>
            </div>
          </Col>
          <Col lg={8} xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => setOpenDrawer(true)}>Tạo mới</Button>
          </Col>
        </Row>
        <div
          style={{
            // display: 'flex',
            alignItems: 'center',
            marginTop: '10px',
            gap: '5px',
            width: 'fit-content',
            padding: '10px',
            borderRadius: '10px',
            border: '1px solid #ccc',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
            <Typography className="me-[10px]" style={{ marginInlineEnd: '10px' }}>
              Ngày tạo:
            </Typography>
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
            <Typography>Giá mua: Từ</Typography>
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
              value={priceRangeFilter.from}
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
              style={{ margin: '0 7px' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              value={priceRangeFilter.to}
            />
          </div>
          <Space size="large" style={{ marginTop: '10px' }}>
            <Button onClick={onFilter}>
              <Typography>Lọc</Typography>
            </Button>

            <Button
              onClick={() => {
                setCodeFilter('');
                setFilterQuery('');
                setTypeFilter('');
                setStatusFilter('');
                setSelectedDates(null);
                setPriceRangeFilter({
                  from: null,
                  to: null,
                });
                setCreateDateFilter({
                  end_date: '',
                  start_date: '',
                });
                setTableParams({
                  ...tableParams,
                  pagination: {
                    ...tableParams.pagination,
                    current: 1,
                  },
                });
              }}
            >
              Reset bộ lọc
            </Button>
          </Space>
        </div>
      </div>
      <div>
        {selectedRow.length > 0 && checkIsNewSignal() && (
          <>
            <Button
              className="mb-[5px]"
              style={{ marginBottom: '5px' }}
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
              style={{ marginBottom: '5px' }}
              onClick={() => {
                handleApproveSignal(selectedRow, false);
              }}
            >
              Từ chối khuyến nghị
            </Button>
          </>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <Typography>Có tất cả {count} kết quả</Typography>
        <ExportExcel columns={columns} dataSource={dataExcel} title="Danh sách duyệt khuyến nghị" />
      </div>
      <Table
        columns={columns}
        rowKey={record => record.id}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
        scroll={{ x: 'max-content', y: '100%' }}
        expandable={{
          expandedRowRender: record => {
            console.log('record__________________________', record);

            return (
              <div className="text-left" style={{ textAlign: 'left' }}>
                <div>
                  <Typography style={{ margin: 0 }}>Mô tả : {record?.description}</Typography>
                </div>
                <div>
                  <Typography style={{ margin: 0 }}>Ghi chú : {record?.note}</Typography>
                </div>
                {record?.detail_chart && (
                  <Space direction="vertical">
                    <Typography style={{ margin: 0 }}>Image Chart:</Typography>
                    <Image
                      src={record.detail_chart}
                      width={100}
                      height={100}
                      style={{ borderRadius: '8px', objectFit: 'cover' }}
                    />
                  </Space>
                )}
              </div>
            );
          },
        }}
        rowSelection={{
          type: 'checkbox',
          onChange: (value: any) => {
            // console.log('value___________________rowSelection', value);
            setSelectedRow(value);
          },
        }}
        style={{ height: 'auto' }}
      />
      <CreateSingalDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        onSubmit={handleCreateSignal}
        spining={spining}
      />
      <UpdateSingalDrawer
        open={openUpdateDrawer}
        onClose={() => setOpenUpdateDrawer(false)}
        onSubmit={handleUpdateSignal}
        data={updateData}
        spining={spining}
      />
    </div>
  );
};

export default Recommendations;
