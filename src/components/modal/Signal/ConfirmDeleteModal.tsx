import { Modal, Typography } from 'antd'
import React from 'react'

interface ConfirmDeleteModalProps {
    open?: boolean
    handleOk?: () => void
    confirmLoading?: boolean
    handleCancel?: () => void
}

function ConfirmDeleteModal({
    open,
    handleOk,
    confirmLoading,
    handleCancel
}: ConfirmDeleteModalProps) {
    return (
        <Modal
            title="Xác nhận rằng bạn chắc chắn"
            open={open}
            onOk={handleOk}
            confirmLoading={confirmLoading ? true : false}
            onCancel={handleCancel}
            okText={<Typography>Ok</Typography>}
        >
            <Typography>Bạn chắc chắn xóa chứ</Typography>
        </Modal>
    )
}

export default ConfirmDeleteModal