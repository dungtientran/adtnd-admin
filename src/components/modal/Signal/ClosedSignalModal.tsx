import { Input, InputNumber, Modal, Typography } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React from 'react'

interface ClosedSignalModalProps {
    open?: boolean
    handleOk?: () => void
    confirmLoading?: boolean
    handleCancel?: () => void,
    data: any
    setData: (value: any) => void
}

function ClosedSignalModal({
    open,
    handleOk,
    handleCancel,
    data,
    setData,
}: ClosedSignalModalProps) {
    return (
        <Modal
            title="Đóng khuyến nghị"
            open={open}
            onOk={handleOk}
            confirmLoading={data.data?.loading ? true : false}
            onCancel={handleCancel}
        >
            <div>
                <div>
                    <Typography>Lí do</Typography>
                    <Input
                        value={data.data.closed_reason}
                        onChange={e => setData({
                            ...data,
                            data: {
                                ...data.data,
                                closed_reason: e.target.value
                            }
                        })}
                    />
                </div>
                <div>
                    <Typography>Giá đóng</Typography>
                    <InputNumber
                        value={data.data.closed_price}
                        onChange={value => setData({
                            ...data,
                            data: {
                                ...data.data,
                                closed_price: value
                            }
                        })}
                    />
                </div>
            </div>
        </Modal>
    )
}

export default ClosedSignalModal