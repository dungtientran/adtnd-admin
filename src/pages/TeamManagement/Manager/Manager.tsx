import type { DataType, TableParams } from './index.interface';

import './index.less';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Drawer, message, Table } from 'antd';
import qs from 'qs';
import { useEffect, useState } from 'react';

import { listTeamManagementApi } from '@/api/ttd_team_management';
import CreateManager from '@/pages/components/form/form-create-manager';
import HeadTitle from '@/pages/components/head-title/HeadTitle';
import Result from '@/pages/components/result/Result';

import { Column } from './columns';

const { createManagement, getListManagement, deleteManagement } = listTeamManagementApi;

export const salePosition = ['Trưởng phòng', 'Giám đốc kinh doanh', 'Giám đốc Khối'];

const Manager: React.FC = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      pageSizeOptions: [10, 20, 50],
    },
  });
  const [searchText, setSearchText] = useState({});
  const [searchedColumn, setSearchedColumn] = useState('');
  const [listCustomerSp, setListCustomerSp] = useState([]);
  const [queryFilter, setQueryFilter] = useState<string>('');
  const [customerSelect, setCustomerSelect] = useState<any>();
  const [total, setTotal] = useState(0);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['getListManagerManagement'],
    queryFn: () => getListManagement('1'),
  });

  const onClose = () => {
    setOpen(false);
  };

  const useDirector = () => {
    const create = useMutation(createManagement, {
      onSuccess: () => {
        queryClient.invalidateQueries(['getListManagerManagement']);
        message.success('Tạo thành công');
        setOpen(false);
      },
      onError: (err: any) => {
        message.error(`${err?.message}` || 'Tạo thất bại');
      },
    });
    const remove = useMutation(deleteManagement, {
      onSuccess: () => {
        queryClient.invalidateQueries(['getListManagerManagement']);
        message.success('Xóa thành công');
      },
      onError: (err: any) => {
        message.error(`${err?.message}` || 'Update thất bại');
      },
    });

    return { create, remove };
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

  useEffect(() => {
    if (!data) return;

    if (data) {
      const directorColums = data?.data?.rows?.map((item: any) => {
        const directorColum: DataType = {
          child_id: item?.child_admin?.id,
          child_name: item?.child_admin?.fullname,
          child_staff_code: item?.child_admin?.staff_code,
          parent_id: item?.parent_admin?.id,
          parent_name: item?.parent_admin?.fullname,
          parent_staff_code: item?.parent_admin?.staff_code,
        };

        return directorColum;
      });

      setListCustomerSp(directorColums);
    }
  }, [data]);

  return (
    <div className="aaa">
      <HeadTitle title="Quản lý đội nhóm cấp trưởng phòng" />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Button
          type="primary"
          onClick={() => {
            setOpen(true), setCustomerSelect(undefined);
          }}
        >
          Tạo quản lý mới
        </Button>
      </div>
      <Result total={data?.data?.count} searchText={searchedColumn} isButtonExcel={false} />
      <div className="">
        <Table
          columns={Column(listCustomerSp, setTotal, useDirector)}
          dataSource={listCustomerSp}
          loading={isLoading}
          onChange={handleTableChange}
          scroll={{ x: 'max-content', y: '100%' }}
          style={{ height: 'auto' }}
        />
      </div>
      <Drawer
        title={!customerSelect ? 'Tạo mới quản trị viên' : 'Chỉnh sửa '}
        width={360}
        onClose={onClose}
        open={open}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <CreateManager initForm={customerSelect} useSale={useDirector} />
      </Drawer>
    </div>
  );
};

export default Manager;
