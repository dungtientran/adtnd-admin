import { Input, Modal, Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React from 'react';

interface SendSignalNotificationModalProps {
  open?: boolean;
  handleOk?: () => void;
  confirmLoading?: boolean;
  handleCancel?: () => void;
  form: {
    title: string;
    description: string;
    loading: boolean;
  };
  setForm: (value: any) => void;
}

function SendSignalNotificationModal({
  open,
  handleOk,
  handleCancel,
  form,
  setForm,
}: SendSignalNotificationModalProps) {
  return (
    <Modal
      title="Gửi thông báo khuyến nghị"
      open={open}
      onOk={handleOk}
      confirmLoading={form?.loading ? true : false}
      onCancel={handleCancel}
    >
      <div>
        <div>
          <Typography>Tiêu đề</Typography>
          <Input
            value={form.title}
            onChange={e =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
          />
        </div>
        <div>
          <Typography>Nội dung</Typography>
          <TextArea
            value={form.description}
            onChange={e =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
            autoSize
          />
        </div>
      </div>
    </Modal>
  );
}

export default SendSignalNotificationModal;
