import type { TableParams } from '@/pages/CustomerManagement/ListCustomers/index.interface';

import { MenuOutlined, UserAddOutlined } from '@ant-design/icons';
import {
  AutoComplete,
  Avatar,
  Button,
  Checkbox,
  Drawer,
  Dropdown,
  Form,
  InputNumber,
  notification,
  Radio,
  Select,
  Space,
  Table,
  Typography,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AddMemberToGroup, GetMemberNotIn } from '@/api/group';
import { getColumnSearchProps } from '@/pages/components/Table/SearchInTable';
import { addmember, getGroupMember } from '@/stores/group/group.actions';

const { Option } = Select;

interface AddMemberProps {
  onClose: () => void;
  onSubmit: (value: any) => any;
  open: boolean;
  group_id?: string | undefined;
}

function AddMember({ open, onClose, onSubmit, group_id }: AddMemberProps) {
  const dispacth = useDispatch();
  const [data, setData] = useState();
  const subscriptions = useSelector(state => state.subsciptions.subscriptions);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [selectedRow, setSelectedRow] = useState<any>([]);
  // live search state
  const [nameSearch, setNameSearch] = useState(null);
  const [emailSearch, setEmailSearch] = useState(null);
  const [phoneSearch, setPhoneSearch] = useState(null);
  const [subsciptionFilter, setSubsciptionFilter] = useState<any>([]);
  const [filterQuery, setFilterQuery] = useState<any>([]);

  const getCustomer = async () => {
    console.log('get customer');
    setLoading(true);
    await GetMemberNotIn(group_id, tableParams.pagination, filterQuery)
      .then((data: any) => {
        if (data.code === 200) {
          console.log('data .....', data.data);
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
      .catch((error: any) => {
        console.log(error);
      });

    setLoading(false);
  };

  const subscriptionFilterChange = (isAdd: boolean, value: string) => {
    const new_data = [...subsciptionFilter];

    console.log(new_data);

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

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    console.log(pagination);
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

  const handleAddMemnerToGroup = async (form: any, record: any) => {
    setLoading(true);
    await AddMemberToGroup(form)
      .then((res: any) => {
        if (res.code === 200) {
          notification.success({
            message: 'Thêm thành công!',
          });

          if (form?.customer_ids?.length > 0) {
            dispacth(getGroupMember(form.group_id, undefined, undefined));
            setSelectedRow([]);
          } else {
            dispacth(addmember(record));
          }

          getCustomer();
        }
      })
      .catch((err: any) => {
        console.log(err);
        notification.error({
          message: err.message,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const checkIsFilter = () => {
    if (nameSearch != null || emailSearch != null || phoneSearch != null || subsciptionFilter.length > 0) return true;

    return false;
  };

  const resetFilter = () => {
    setNameSearch(null);
    setEmailSearch(null);
    setPhoneSearch(null);
    setSubsciptionFilter([]);
    setFilterQuery('');
  };

  useEffect(() => {
    if (nameSearch != null || emailSearch != null || phoneSearch != null || subsciptionFilter.length > 0) {
      let query = '';

      if (nameSearch) {
        query += '&name=' + nameSearch;
      }

      if (emailSearch) {
        query += '&email=' + emailSearch;
      }

      if (phoneSearch) {
        query += '&phone_number=' + phoneSearch;
      }

      if (subsciptionFilter.length > 0) {
        console.log('subscription filtered', subsciptionFilter);

        query += `&subscriptions=${subsciptionFilter.join(',')}`;
      }

      setFilterQuery(query);
    }
  }, [nameSearch, emailSearch, phoneSearch, subsciptionFilter]);
  useEffect(() => {
    if (group_id) {
      getCustomer();
    }
  }, [group_id, JSON.stringify(tableParams), filterQuery]);

  const columns = [
    {
      title: 'Mã khách hàng',
      dataIndex: 'customer_code',
      width: '8%',
      // render: (_: any, record: any) => (
      //   <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      //     <Avatar
      //       src={record.avatar_url}
      //       size="large"
      //       onClick={() => {
      //         // setModalOpen(true), setRecordSelected(record);
      //       }}
      //     />
      //   </div>
      // ),
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'fullname',
      render: (text: string) => <Typography className="text-center">{text}</Typography>,
      ...getColumnSearchProps({
        setFilter: setNameSearch,
      }),
    },
    {
      title: 'Gói dịch vụ',
      dataIndex: ['subscription_product', 'name'],
      dataType: 'text',
      width: '20%',
      render: (text: any, record: any) => {
        return (
          <Typography className="text-center">
            {record?.Subscriptions?.length > 0 ? record?.Subscriptions[0]?.subscription_product?.name : 'Không có '}
          </Typography>
        );
      },
      filterDropdown: () => {
        return (
          <div>
            <Checkbox.Group className="flex-col ps-[5px]">
              {subscriptions?.map((item: any, index: number) => {
                return (
                  <Checkbox
                    value={item.id}
                    className={`${index == 0 ? 'ml-[8px]' : ''}`}
                    onChange={e => {
                      console.log('111');
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
      title: 'Số điện thoại',
      sorter: true,
      dataIndex: 'phone_number',
      ...getColumnSearchProps({
        setFilter: setPhoneSearch,
      }),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: '8%',
      ...getColumnSearchProps({
        setFilter: setEmailSearch,
      }),
    },
    {
      title: 'Hành dộng',
      dataIndex: 'email',
      width: '8%',
      render: (_: any, record: any) => {
        return (
          <>
            <Button
              onClick={() => {
                handleAddMemnerToGroup(
                  {
                    group_id: group_id,
                    customer_id: record.id,
                  },
                  record,
                );
              }}
            >
              <UserAddOutlined />
            </Button>
          </>
        );
      },
    },
  ];

  // console.log("data________________________", data);

  return (
    <Drawer
      title="Thêm thành viên mới"
      width={'80%'}
      onClose={onClose}
      open={open}
      bodyStyle={{ paddingBottom: 80 }}
      extra={
        <Space>
          <Button onClick={onClose}>Hủy</Button>
          <Button onClick={() => {}} type="primary">
            <Typography>Tạo</Typography>
          </Button>
        </Space>
      }
    >
      <div>
        {checkIsFilter() && (
          <>
            <Button
              onClick={() => {
                resetFilter();
              }}
              className="mb-[10px]"
              style={{ marginBottom: '10px' }}
            >
              <Typography>Reset Bộ Lọc</Typography>
            </Button>
          </>
        )}
        {selectedRow.length > 0 && (
          <>
            <Button
              onClick={() => {
                if (group_id) {
                  handleAddMemnerToGroup(
                    {
                      group_id: group_id,
                      customer_ids: selectedRow,
                    },
                    null,
                  );
                }
              }}
              className="mb-[10px]"
            >
              <Typography>Thêm vào nhóm</Typography>
            </Button>
          </>
        )}
      </div>
      <div>
        <Table
          columns={columns}
          rowKey={record => record.id}
          dataSource={data}
          pagination={tableParams.pagination}
          onChange={handleTableChange}
          scroll={{ x: 'max-content', y: '100%' }}
          rowSelection={{
            type: 'checkbox',
            onChange: (value: any) => {
              console.log(value);
              setSelectedRow(value);
            },
          }}
          style={{ height: 'auto' }}
        />
      </div>
    </Drawer>
  );
}

export default AddMember;
