import { getGroupDetail, updateGroupDetail,deleteGroup } from '@/stores/group/group.actions'
import { Button, Typography } from 'antd'
import React, { useEffect, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import './index.less'
import GroupMemberTable from './GroupMemberTable'
import CreateGroupModal from '@/components/modal/Group/CreateGroupModal'
import ConfirmDeleteModal from '@/components/modal/Signal/ConfirmDeleteModal'
import { useNavigate } from "react-router-dom";
function GroupDetailPage() {
    const param = useParams()
    const id = param.id
    const navigate = useNavigate();
    const [groupModal, setGroupModal] = useState<boolean>(false);
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const dispacth = useDispatch()
    const fetchData = useCallback(() => {
        if (id) {
            dispacth(getGroupDetail(id))
        }
    }, [id])

    //--------------------
    const groupDetail = useSelector(state => state.group.groupDetail)
    const handleUpdate = async(data:any) => {
        if(groupDetail){
            const res : any = await dispacth(updateGroupDetail(groupDetail?.id, data))
            if(!!res){
                console.log('res ', res)
            }
        }
    }
    const handleDelete = async() => {
        if(groupDetail){
            const res : any = await dispacth(deleteGroup(groupDetail?.id))
            console.log('res ::',res)
            if(!!res){
                navigate('/customer-management/customer-group')
            }
        }
    }

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return (
        <div >
            <div style={{ textAlign: 'center' }}>
                <Typography.Title level={2}>XEM CHI TẾT NHÓM</Typography.Title>
            </div>

            <div 
                style={{
                    padding: '20px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                }}
            >
                <div className='flex justify-between'
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}
                >
                    <div>
                        <Typography>Thông tin nhóm</Typography>
                    </div>
                    <div className='flex gap-3'
                         style={{
                            display: 'flex',
                            gap: '5px'
                        }}
                    >
                        <Button onClick={()=>setDeleteModal(true)}><Typography>Xóa nhóm</Typography></Button>
                        <Button  onClick={()=>setGroupModal(true)}><Typography>Sửa nhóm</Typography></Button>
                    </div>
                </div>
                <div>
                    <Typography><span className='font-bold'>Tên nhóm : </span> {groupDetail?.name}</Typography>
                    <Typography><span className='font-bold'>Mô tả : </span> {groupDetail?.description}</Typography>
                    {/* <Typography><span className='font-bold'>
                        Lọc bằng : </span> {
                            groupDetail?.subscription_product ? 'Gói dịch vụ ' + groupDetail.subscription_product.name :
                                groupDetail?.nav_low ? 'NAV' : 'Không lọc'
                        }
                    </Typography> */}
                    {groupDetail?.subscription_product && (
                        <Typography>
                            <span className='font-bold'>Gói dịch vụ: </span> {groupDetail?.subscription_product.name}
                        </Typography>
                    )}
                    {groupDetail?.nav_low && (
                        <Typography>
                            <span className='font-bold'>Khoảng Nav: </span> {parseInt(groupDetail?.nav_low).toLocaleString()} - {parseInt(groupDetail?.nav_high).toLocaleString()}
                        </Typography>
                    )}
                    <Typography><span className='font-bold'>Số lượng thành viên : </span> {groupDetail?.member_count}</Typography>
                </div>
            </div>
            <GroupMemberTable
                group_id={id}
            />
            <ConfirmDeleteModal open={deleteModal} handleOk={handleDelete} handleCancel={()=>setDeleteModal(false)}/>
            <CreateGroupModal
                data={groupDetail}
                setData={()=>{}}
                open={groupModal}
                handleOk={handleUpdate}
                handleCancel={() => {
                    setGroupModal(false)
                }}
            />
        </div>
    )
}

export default GroupDetailPage