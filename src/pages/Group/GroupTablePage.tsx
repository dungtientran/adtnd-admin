import type { TablePaginationConfig } from 'antd';
import type { FilterValue } from 'antd/es/table/interface';

import './index.less';

import { MenuOutlined } from '@ant-design/icons';
import { Button, Checkbox, Dropdown, notification, Table, Typography } from 'antd';
import { PaginationConfig } from 'antd/es/pagination';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { createGroup, getGroupList, updateGroup } from '@/api/group';
import CreateGroupModal from '@/components/modal/Group/CreateGroupModal';
import { addTag, removeTag, setActiveTag } from '@/stores/tags-view.store';

import ExportExcel from '../components/button-export-excel/ExportExcel';
import { getColumnSearchProps } from '../components/Table/SearchInTable';

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}

function GroupTablePage() {
  const subscriptions = useSelector(state => state.subsciptions.subscriptions);

  const [loading,setLoading] = useState(false)
  const [data, setData] = useState<any>();
  const [dataExcel, setDataExcel] = useState([]);

  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      pageSizeOptions: [10, 20, 50],
    },
  });
  const [selectedRow, setSelectedRow] = useState<any>([]);

  // live search state
  const [nameSearch, setNameSearch] = useState(null);
  const [saleSearch, setSaleSearch] = useState(null);
  const [filterQuery, setFilterQuery] = useState('');
  const [subsciptionFilter, setSubsciptionFilter] = useState<any>([]);

  //modal state -------------------------->
  const [groupModal, setGroupModal] = useState<boolean>(false);
  const [update, setUpdate] = useState<any>();

  // --------------
  const getData = async () => {
    setLoading(true);
    await getGroupList(tableParams.pagination, '', filterQuery)
      .then((data: any) => {
        // console.log("data________________", data);

        if (data) {
          setTableParams({
            ...tableParams,
            pagination: {
              ...tableParams.pagination,
              total: data?.count,
            },
          });
          const columns = data?.data?.map((item: any) => {
            const column = {
              ...item,
              service_pack: item?.subscription_product?.name,
              sale_email: item?.sale?.email,
            };

            return column;
          });

          setData(columns);
        }
      })
      .catch(error => {
        console.log(error);
      }).finally(()=>{
        setLoading(false);
      });
  };

  const getDataExcel = async (limit: number) => {
    await getGroupList({ current: 1, pageSize: limit }, '', filterQuery)
      .then((data: any) => {
        if (data) {
          const columns = data?.data?.map((item: any) => {
            const column = {
              ...item,
              service_pack: item?.subscription_product?.name,
              sale_email: item?.sale?.email,
            };

            return column;
          });

          setDataExcel(columns);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (tableParams.pagination?.total) getDataExcel(tableParams.pagination?.total);
  }, [tableParams.pagination?.total]);

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

  const subscriptionFilterChange = (isAdd: boolean, value: string) => {
    const new_data = [...subsciptionFilter];

    if (isAdd) {
      new_data.push(value);
    } else {
      const index = new_data.indexOf(value);

      if (index !== -1) {
        new_data.splice(index, 1);
      }
    }

    setSubsciptionFilter(new_data.length > 0 ? new_data : ['']);
  };

  const actions = (record: any) => {
    const actionList = [];

    actionList.push({
      key: '1',
      label: (
        <Link to={`/customer-management/customer-group/detail/${record.id}`} className="text-left">
          <Typography
            onClick={() => {
              console.log(record.id);
            }}
          >
            Xem chi tiết
          </Typography>
        </Link>
      ),
    });
    actionList.push({
      key: '2',
      label: (
        <Typography
          onClick={() => {
            setUpdate(record);
            setGroupModal(true);
          }}
        >
          Sửa
        </Typography>
      ),
    });

    return actionList;
  };

  const dispatch = useDispatch();

  const handelAddTag = (id: string, name: string) => {
    dispatch(
      addTag({
        code: 'con tro lơ',
        closable: true,
        label: {
          en_US: `${name}`,
          zh_CN: 'asdas',
        },
        path: `/customer-management/customer-group/detail/${id}`,
      }),
    );
  };

  const actionsColumn = {
    title: '',
    width: '20%',
    editable: false,
    render: (_: any, record: any) => (
      <Dropdown menu={{ items: actions(record) }} arrow placement="bottom">
        <Button type="ghost" size="small" shape="circle">
          <MenuOutlined />
        </Button>
      </Dropdown>
    ),
  };
  const columns = [
    {
      title: 'Tên nhóm',
      dataIndex: 'name',
      dataType: 'text',
      width: '20%',
      render: (text: string, record: any) => (
        <Link
          to={`/customer-management/customer-group/detail/${record.id}`}
          style={{ textAlign: 'left', textDecoration: 'none' }}
          onClick={() => handelAddTag(record.id, record.name)}
        >
          {text}
        </Link>
        // <Typography.Link>
        //   <a href={`/customer-management/customer-group/detail/${record.id}`}>{text}</a>
        // </Typography.Link>
      ),
      ...getColumnSearchProps({
        setFilter: setNameSearch,
      }),
    },
    {
      title: 'Gói dịch vụ',
      dataIndex: 'service_pack',
      // dataType: 'text',
      width: '20%',
      // render: (text: string, record: any) => <Typography className="text-center">{text}</Typography>,
      filterDropdown: () => {
        return (
          <div>
            <Checkbox.Group style={{ display: 'flex', flexDirection: 'column', paddingInlineStart: '5px' }}>
              {subscriptions?.map((item: any, index: number) => {
                return (
                  <Checkbox
                    value={item.id}
                    style={{
                      marginLeft: `${index == 0 ? '8px' : ''}`,
                    }}
                    onChange={e => {
                      subscriptionFilterChange(e.target.checked, item.id);
                    }}
                  >
                    {item.name}
                  </Checkbox>
                );
              })}
            </Checkbox.Group>
          </div>
        );
      },
    },
    {
      title: 'Nhân viên chăm sóc',
      dataIndex: 'sale_email',
      // dataType: 'text',
      width: '30%',
      // render: (text: string, record: any) => <Typography className="text-center">{text}</Typography>,
      ...getColumnSearchProps({
        setFilter: setSaleSearch,
      }),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      width: '20%',
    },
    actionsColumn,
  ];

  useEffect(() => {
    if (nameSearch != null || subsciptionFilter.length > 0 || saleSearch != null) {
      let query = '';

      if (nameSearch) {
        query += `&searchText=${nameSearch}`;
      }

      if (saleSearch) {
        query += `&saleSearch=${saleSearch}`;
      }

      if (subsciptionFilter.length > 0) {
        query += `&subscriptionFilter=${subsciptionFilter.join(',')}`;
      }

      setFilterQuery(query);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          current:1
        }
      })
    }
  }, [nameSearch, subsciptionFilter, saleSearch]);
  useEffect(() => {
    getData();
  }, [JSON.stringify(tableParams), filterQuery]);

  const handleCreateGroup = async (form: any) => {
    console.log(form);

    if (update) {
      return await updateGroup(update.id, form)
        .then((res: any) => {
          const new_data = [...data].map(item => {
            if (item.id == update.id) {
              return {
                ...item,
                ...form,
              };
            }
            return item;
          });

          setData(new_data);
          setUpdate(null);
          setGroupModal(false);
          notification.success({
            message: 'Cập nhật thành công!',
          });

          return true;
        })
        .catch(error => {
          notification.error({
            message: error.message,
          });

          return true;
        });
    } else {
      return await createGroup(form)
        .then((res: any) => {
          if (res.code == 200) {
            const new_data = [res.data, ...data];
            setData(new_data);
          }
          notification.success({
            message: 'Tạo thành công!',
          });
          setGroupModal(false);
        })
        .catch(err => {
          console.log('err when creating group', err);
          notification.error({
            message: err.message,
          });

          return true;
        });
    }
  };

  const checkIsFilter = () => {
    if (nameSearch != null || saleSearch != null || subsciptionFilter.length > 0) return true;

    return false;
  };

  const resetFilter = () => {
    setNameSearch(null);
    setSaleSearch(null);
    setSubsciptionFilter([]);
    setFilterQuery('');
  };

  return (
    <div>
      <div style={{ textAlign: 'center' }}>
        <Typography.Title level={2}>Danh sách nhóm khách hàng</Typography.Title>
      </div>

      <Button
        onClick={() => {
          resetFilter();
        }}
        style={{ marginBottom: '10px' }}
      >
        <Typography>Reset Bộ Lọc</Typography>
      </Button>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          onClick={() => {
            setUpdate(null);
            setGroupModal(true);
          }}
        >
          <Typography>Tạo nhóm mới</Typography>
        </Button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '10px' }}>
        <Typography style={{ marginTop: '10px' }}>Có tất cả {tableParams.pagination?.total} kết quả</Typography>
        <ExportExcel columns={columns} dataSource={dataExcel} title='Danh sách nhóm khách hàng'/>
      </div>
      <div className="table_member">
        <Table
          loading={loading}
          columns={columns}
          rowKey={record => record.id}
          dataSource={data}
          pagination={tableParams.pagination}
          onChange={handleTableChange}
          scroll={{ x: 'max-content', y: '100%' }}
          // rowSelection={{
          //   type: 'checkbox',
          //   onChange: (value: any) => {
          //     console.log(value);
          //     setSelectedRow(value);
          //   },
          // }}
        />
      </div>
      <CreateGroupModal
        data={update}
        setData={setGroupModal}
        open={groupModal}
        handleOk={handleCreateGroup}
        handleCancel={() => {
          setGroupModal(false);
        }}
      />
    </div>
  );
}

export default GroupTablePage;
