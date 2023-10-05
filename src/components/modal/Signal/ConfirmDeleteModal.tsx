import { Modal } from 'antd'
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
        >
            <p>Bạn chắc chắn xóa chứ</p>
        </Modal>
    )
}

export default ConfirmDeleteModal