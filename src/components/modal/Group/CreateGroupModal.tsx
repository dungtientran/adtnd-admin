import { adminSearchUser } from '@/api/user.api'
import { AutoComplete, Input, InputNumber, Modal, Select, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const { TextArea } = Input
const { Option } = Select
interface CreateGroupModalProps {
    open?: boolean
    handleOk: (form: any) => Promise<any>
    confirmLoading?: boolean
    handleCancel?: () => void,
    data: any
    setData: (value: any) => void
}
function CreateGroupModal({
    open,
    handleOk,
    handleCancel,
    data,
    setData,
}: CreateGroupModalProps) {
    const subscriptions = useSelector(state => state.subsciptions.subscriptions)
    const [filter, setFilter] = useState(0)
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        name: '',
        description: '',
        sale_id: '',
        subscription_product_id: '',
        sale: {} as any
    })
    const [customerOptions, setCustomerOptions] = useState<any[]>([]);
    const handleSearchCustomer = async (text: string) => {
        try {
            setForm({
                ...form,
                sale_id: ''
            })
            const res: any = await adminSearchUser(text);
            console.log('search data', res);
            setCustomerOptions(res.map((item: any) => ({ ...item, value: item.email })));
        } catch (error) {
            setCustomerOptions([]);
        }
    };

    const handleSubmit = async () => {
        if(loading) return
        setLoading(true);
        await handleOk(form)
        setLoading(false);
    }
    useEffect(()=>{
        console.log('update : >>>>>>>>>>>> ' , data)
        if(data){
            setForm({
                name: data.name,
                description: data.description,
                sale_id: data.sale_id,
                subscription_product_id: data.subscription_product_id,
                sale:data?.sale || {}
            })
            if(data.subscription_product_id){
                setFilter(1)
            }
        }
    },[data])
    return (
        <Modal
            title="Tạo nhóm mới"
            open={open}
            onOk={() => {
                handleSubmit()
            }}
            confirmLoading={loading}
            onCancel={handleCancel}
        >
            <div>
                <div>
                    <Typography>Tên nhóm</Typography>
                    <Input
                        value={form.name}

                        onChange={e => setForm({
                            ...form,
                            name: e.target.value
                        })}
                    />
                </div>
                <div>
                    <Typography>Mô tả</Typography>
                    <TextArea
                        value={form.description}
                        onChange={e => setForm({
                            ...form,
                            description: e.target.value
                        })}
                        autoSize={{ minRows: 3, maxRows: 7 }}
                    />
                </div>

                <div>
                    <Typography> Lọc bằng</Typography>
                    <Select 
                        placeholder={'Không lọc'} 
                        onChange={(value) => setFilter(value)} className='w-[120px]'
                        value={filter}
                    >
                        <Option value={0}>{'Không lọc'}</Option>
                        <Option value={1}>{'Gói dịch vụ'}</Option>
                        <Option value={2}>{'Nav'}</Option>
                    </Select>
                </div>
                {filter == 1 && (
                    <>

                        <div className='mt-[10px]'>
                            <Typography> Chọn gói dịch vụ</Typography>
                            <Select
                                value={form.subscription_product_id}
                                className='w-full'
                                placeholder={'Chọn gói dịch vụ'}
                                onChange={(value) => setForm({ ...form, subscription_product_id: value })}
                                options={[...subscriptions?.map((item) => ({ label: item.name, value: item.id }))]}
                            />
                        </div>
                        <div>
                            <Typography>Nhân viên chăm sóc</Typography>
                            <AutoComplete
                                style={{ width: '100%' }}
                                defaultValue={form?.sale?.email}
                                options={customerOptions}
                                placeholder={'Nhập email khách hàng'}
                                onSearch={(e) => handleSearchCustomer(e)}
                                onSelect={(e: any) => {
                                    const item = customerOptions.find((option) => option.value === e);
                                    setForm({
                                        ...form,
                                        sale_id: item.id
                                    });
                                }}
                            />
                        </div>
                    </>
                )}
            </div>
        </Modal>
    )
}

export default CreateGroupModal