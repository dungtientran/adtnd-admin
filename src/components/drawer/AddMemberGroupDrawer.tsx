
import { AutoComplete, Button,Drawer, Form, InputNumber, Radio, Select, Space, Typography } from 'antd'
import TextArea from 'antd/es/input/TextArea';
import React, { useState } from 'react'
const { Option } = Select;
interface AddMemberProps {
    onClose: () => void;
    onSubmit: (value: any) => any;
    open: boolean;
}

function AddMember({
    open,
    onClose,
    onSubmit
}: AddMemberProps) {
    const [form] = Form.useForm();



    return (
        <Drawer
            title="Thêm thành viên mới"
            width={720}

            onClose={onClose}
            open={open}
            bodyStyle={{ paddingBottom: 80 }}
            extra={
                <Space>
                    <Button onClick={onClose}>Hủy</Button>
                    <Button onClick={() => form.submit()} type="primary">
                        <Typography>Tạo</Typography>
                    </Button>
                </Space>
            }
        >

        </Drawer>
    )
}

export default AddMember