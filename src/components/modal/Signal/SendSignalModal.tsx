import { getGroupList } from '@/api/group'
import { searchStock } from '@/api/stock.api'
import { adminGetUser } from '@/api/user.api'
import { IlistStock } from '@/interface/stock/stock.interface'
import { Alert, AutoComplete, Checkbox, Col, Form, Input, InputNumber, Modal, Radio, Row, Select, Typography, notification } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React, { useState, useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'

interface SendSignalModalProps {
    open?: boolean
    handleOk: (value:any) => any
    confirmLoading?: boolean
    handleCancel?: () => void,
}

function SendSignalModal({
    open,
    handleOk,
    handleCancel,
}: SendSignalModalProps) {
    const subscriptions = useSelector(state => state.subsciptions.subscriptions)
    const [targetSubscriptions, setTargetSubscriptions] = useState<any>([]);
    const [groups, setGroups] = useState<any>([]);
    const [targetGroup, setTargetGroup] = useState<any>([]);
    const [step, setStep] = useState(0)
    const [form] = Form.useForm();
    const [stockList, setStockList] = useState<IlistStock[]>([]);
    const [user, setUser] = useState<any>(null);
    const [sendAll, setSendAll] = useState(false);

    const handleSearchStock = async (query: string) => {
        searchStock(query).then((res: any) => {
            setStockList(res);
        });
    };
    const resetUser = () => {
        setUser(null);
        if (form.getFieldValue('email') !== '') {
            form.setFields([
                {
                    name: 'customer_id',
                    value: null,
                },
            ]);
        }
    };
    const fetchUser = useCallback(
        (email: string) => {
            adminGetUser(email)
                .then((res: any) => {
                    console.log('user', res)
                    if (res?.customer) {
                        setUser(res.customer);
                        form.setFieldValue('customer_id', res.customer.id);
                    } else {
                        resetUser();
                    }
                })
                .catch((error) => {
                    console.log('error', error)
                    resetUser();
                });
        },
        [user],
    );
    const fetchGroups = () => {
        getGroupList({
            current: 1,
            pageSize: 1000,
        }).then((res: any) => {
            console.log(res);
            setGroups(res.data);
        });
    }

    const handleFormSubmit = async(value: any) => {
        if (!value.subscription_product_id && !value.customer_id && !value.group_id && sendAll == false) {
            console.log(targetSubscriptions, targetGroup);
            return notification.error({
              message: 'Khuyến nghị phải được gửi đến ít nhất 1 trong 3 loại khách hàng trên',
            });
        } else {
            handleOk({
                ...value,
                is_send_all: sendAll
            });
        }
    }

    useEffect(() => {
        fetchGroups();
    }, []);
    return (
        <Modal
            title="Duyệt khuyến nghị"
            open={open}
            onOk={()=>form.submit()}
            okText={'Gửi'}
            cancelText={'Hủy'}
            // confirmLoading={form?.loading ? true : false}
            onCancel={handleCancel}
        >
            <Form onFinish={handleFormSubmit} form={form}>
                <Typography.Title style={{ marginBottom: 20 }}>Gửi khuyến nghị này đến</Typography.Title>
                <Form.Item label={'Gửi đến tất cả'} name="is_send_all" >
                    <Checkbox name="is_send_all" defaultChecked={sendAll} onChange={(e) => setSendAll(e.target.checked)}/>
                </Form.Item>
                <Form.Item name={subscriptions.length > 0 ? 'subscription_product_id' : ''} label={`Gói dịch vụ`}>
                    <Select
                        placeholder={'Chọn gói dịch vụ'}
                        mode="multiple"
                        defaultValue={targetSubscriptions}
                        onChange={(value) => setTargetSubscriptions(value)}
                        options={[...subscriptions?.map((item) => ({ label: item.name, value: item.id }))]}
                    />
                </Form.Item>
                <Form.Item name={groups.length > 0 ? 'group_id' : ''} label={`Nhóm khách hàng`}>
                    <Select

                        mode="multiple"
                        placeholder={'Chọn nhóm khách hàng'}
                        options={[...groups?.map((item: any) => ({ label: item.name, value: item.id })), { label: 'None', value: null }]}
                        onChange={(value) => setTargetGroup(value)}
                    />
                </Form.Item>
                <Form.Item
                    label={'Khách hàng'}
                    name="email"
                    rules={[
                        {
                            type: 'email',
                            message: 'Email không hợp lệ',
                        },
                    ]}

                >
                    <Input
                        placeholder={'Nhập email người dùng cần gửi'}
                        onChange={async (e) => {
                            const value = e.target.value;
                            if (value) fetchUser(value);
                            else form.setFieldValue('customer_id', null);
                        }}
                    />
                </Form.Item>
                <Form.Item name="customer_id" hidden></Form.Item>
                {user && (
                    <Alert style={{ width: 180, marginBottom: 10 }} message={'Tài khoản hợp lệ'} type="success" showIcon />
                )}
            </Form>
        </Modal>
    )
}

export default SendSignalModal