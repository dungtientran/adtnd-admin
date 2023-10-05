import { searchStock } from '@/api/stock.api'
import { IlistStock } from '@/interface/stock/stock.interface'
import { AutoComplete, Form, Input, Modal, Typography } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React, { useState } from 'react'

interface CreateSigalModalProps {
    open?: boolean
    handleOk?: () => void
    confirmLoading?: boolean
    handleCancel?: () => void,
}

function CreateSignalModal({
    open,
    handleOk,
    handleCancel,
}: CreateSigalModalProps) {

    const [step, setStep] = useState(0)
    const [form] = Form.useForm();
    const [stockList, setStockList] = useState<IlistStock[]>([]);
    const handleSearchStock = async (query: string) => {
        searchStock(query).then((res: any) => {
          setStockList(res);
        });
      };
    return (
        <Modal
            title="Tạo khuyến ghị mới"
            open={true}
            onOk={
                step == 0 ? () => {
                    setStep(1)
                } : handleOk
            }
            okText={step == 0 ? 'Tiếp' : 'Tạo'}
            cancelText={step == 0 ? 'Hủy' : 'Quay lại'}
            // confirmLoading={form?.loading ? true : false}
            onCancel={step == 0 ? handleCancel : () => setStep(0)}
        >
            <Form>
                <div>
                    <Typography className='mb-[5px]'>Mã chứng khoán</Typography>
                    <Form.Item
                        
                        name="code"
                        hasFeedback
                        rules={[
                            { required: true, message: 'Please select an email' },
                            {
                                validator(_, value: string) {
                                    console.log(stockList)
                                    const index = stockList.findIndex((item) => value === item.code);
                                    if (index > -1) {
                                        form.setFieldValue('stock_id', stockList[index].id);
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mã CK không hợp lệ!'));
                                },
                            },
                        ]}
                    >
                        <AutoComplete
                            size='large'
                            options={stockList?.map((item) => ({ value: item.code, key: item.id }))}
                            placeholder={'Nhập mã chứng khoán'}
                            filterOption={(inputValue, option: any) => option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                            onSearch={(e) => handleSearchStock(e)}
                        />
                    </Form.Item>
                </div>
                <div>
                    <Typography>Nội dung</Typography>
                    
                </div>
            </Form>
        </Modal>
    )
}

export default CreateSignalModal