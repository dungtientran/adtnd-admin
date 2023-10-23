import './index.less';

import { Button, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import CreateGroupModal from '@/components/modal/Group/CreateGroupModal';
import ConfirmDeleteModal from '@/components/modal/Signal/ConfirmDeleteModal';
import { deleteGroup, getGroupDetail, updateGroupDetail } from '@/stores/group/group.actions';

import GroupMemberTable from './GroupMemberTable';
import { addTag } from '@/stores/tags-view.store';

function GroupDetailPage() {
  const param = useParams();
  const id = param.id;
  const navigate = useNavigate();
  const [groupModal, setGroupModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const dispacth = useDispatch();
  const fetchData = useCallback(() => {
    if (id) {
      dispacth(getGroupDetail(id));
    }
  }, [id]);

  //--------------------
  const groupDetail = useSelector(state => state.group.groupDetail);

  const handleUpdate = async (data: any) => {
    if (groupDetail) {
      const res: any = await dispacth(updateGroupDetail(groupDetail?.id, data));

      if (!!res) {
        console.log('res ', res);
      }
    }
  };

  const handleDelete = async () => {
    if (groupDetail) {
      const res: any = await dispacth(deleteGroup(groupDetail?.id));

      console.log('res ::', res);

      if (!!res) {
        navigate('/customer-management/customer-group');
      }
    }
  };

  const handelAddTag = () => {
    dispacth(
      addTag({
        code: 'con tro lơ',
        closable: true,
        label: {
          en_US: 'aaaaa',
          zh_CN: 'asdas',
        },
        path: '/123456',
      }),
    );
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      <div style={{ textAlign: 'center' }}>
        <Typography.Title level={2}>XEM CHI TẾT NHÓM</Typography.Title>
      </div>

      <div
        //   className="px-[20px] py-[20px] rounded-[6px] border-[#ccc] border-[1px]"
        style={{
          padding: '20px',
          borderRadius: '6px',
          border: '1px solid #ccc',
        }}
      >
        <div
          // className="flex justify-between"
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <div>
            <Typography>Thông tin nhóm</Typography>
          </div>
          <div
            //   className="flex gap-3"
            style={{ display: 'flex', gap: '3px' }}
          >
            <Button onClick={() => setDeleteModal(true)}>
              <Typography>Xóa nhóm</Typography>
            </Button>
            <Button onClick={() => setGroupModal(true)}>
              <Typography>Sửa nhóm</Typography>
            </Button>
          </div>
        </div>
        <div>
          <Typography>
            <span className="font-bold" style={{ fontWeight: 'bold' }}>
              Tên nhóm :{' '}
            </span>{' '}
            {groupDetail?.name}
          </Typography>
          <Typography>
            <span className="font-bold" style={{ fontWeight: 'bold' }}>
              Mô tả :{' '}
            </span>{' '}
            {groupDetail?.description}
          </Typography>
          {/* <Typography><span className='font-bold'>
                        Lọc bằng : </span> {
                            groupDetail?.subscription_product ? 'Gói dịch vụ ' + groupDetail.subscription_product.name :
                                groupDetail?.nav_low ? 'NAV' : 'Không lọc'
                        }
                    </Typography> */}
          {groupDetail?.subscription_product && (
            <Typography>
              <span className="font-bold" style={{ fontWeight: 'bold' }}>
                Gói dịch vụ:{' '}
              </span>{' '}
              {groupDetail?.subscription_product.name}
            </Typography>
          )}
          {groupDetail?.nav_low && (
            <Typography>
              <span className="font-bold" style={{ fontWeight: 'bold' }}>
                Khoảng Nav:{' '}
              </span>{' '}
              {parseInt(groupDetail?.nav_low).toLocaleString()} - {parseInt(groupDetail?.nav_high).toLocaleString()}
            </Typography>
          )}
          <Typography>
            <span className="font-bold" style={{ fontWeight: 'bold' }}>
              Số lượng thành viên :{' '}
            </span>{' '}
            {groupDetail?.member_count}
          </Typography>
        </div>
      </div>
      <GroupMemberTable group_id={id} />
      <ConfirmDeleteModal open={deleteModal} handleOk={handleDelete} handleCancel={() => setDeleteModal(false)} />
      <CreateGroupModal
        data={groupDetail}
        setData={() => {}}
        open={groupModal}
        handleOk={handleUpdate}
        handleCancel={() => {
          setGroupModal(false);
        }}
      />
    </div>
  );
}

export default GroupDetailPage;
