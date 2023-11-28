import type { UseMutationResult } from '@tanstack/react-query';
import { Button, Form, Input, Select, Spin } from 'antd';
import { useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { ImageInsert, AutoImage, Image } from '@ckeditor/ckeditor5-image';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Bold, Italic } from '@ckeditor/ckeditor5-basic-styles';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { MediaEmbed } from '@ckeditor/ckeditor5-media-embed';
import { Base64UploadAdapter } from '@ckeditor/ckeditor5-upload';
import { Font } from '@ckeditor/ckeditor5-font';
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote';
import { AutoLink, Link } from '@ckeditor/ckeditor5-link';
import { List } from '@ckeditor/ckeditor5-list';
import { useState } from 'react';
interface ICreateUser {
    initForm?: any;
    useSale: () => {
        create: UseMutationResult<any, any, any, unknown>;
        update: UseMutationResult<any, any, any, unknown>;
    };
}

const NotificationForm: React.FC<ICreateUser> = ({ initForm, useSale }) => {
    const { create, update } = useSale();
    const [content, setContent] = useState('')

    const handleEditorChange = (event: any, editor: any) => {
        const data = editor.getData();
        setContent(data);
    };
    useEffect(() => {
        if (initForm) {
            const newInit = {
                ...initForm,
                role_id: initForm?.role?.name,
                level: initForm?.SaleLevel?.level,
            };

            form.setFieldsValue(newInit);
        } else {
            form.resetFields();
        }
    }, [initForm]);
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        if (!initForm) {
            return create.mutate({
                ...values,
                content:content
            });
        } else {
            return update.mutate({
                ...values,
                id: initForm?.id,
                content:content
            });
        }
    };

    useEffect(()=>{
        if(initForm?.content) {
            setContent(initForm.content)
        }else {
            setContent('')
        }
    },[initForm?.id])

    return (
        <Form
            form={form}
            name="register"
            layout="vertical"
            autoComplete="off"
            onFinish={onFinish}
            style={{ maxWidth: '100%' }}
            scrollToFirstError
        >
            <Form.Item name="title" label="Tiêu đề: " rules={[{ required: true, message: 'Không được bỏ trống!' }]}>
                <Input />
            </Form.Item>

            <Form.Item name="description" label="Mô tả: " rules={[{ required: true, message: 'Không được bỏ trống!' }]}>
                <Input />
            </Form.Item>

            <Form.Item
                name="notification_category_id"
                label="Loại: "
                rules={[{ required: true, message: 'Không được bỏ trống!' }]}
            >
                <Select
                    // defaultValue={1}
                    style={{ width: 120 }}
                    //  onChange={handleChange}
                    placeholder="Chọn loại"
                    options={[
                        { value: 2, label: 'Hệ thống' },
                        { value: 1, label: 'Chung' },
                    ]}
                />
            </Form.Item>

            <Form.Item name="img_url" label="Url hình ảnh: ">
                <Input />
            </Form.Item>

            <Form.Item name="extend_url" label="Url mở rộng: ">
                <Input />
            </Form.Item>

            <Form.Item label="Nội dung: ">
                <CKEditor editor={ClassicEditor}
                    config={{
                        toolbar: ['undo', 'redo',
                            '|', 'heading',
                            '|', 'fontfamily', 'fontsize',
                            '|', 'bold', 'italic', 'strikethrough', 'subscript', 'superscript', 'code',
                            '|', 'link', 'insertImage', 'mediaEmbed', 'blockQuote',
                            '|', 'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent'
                        ],
                        plugins: [
                            ImageInsert, Essentials, Bold,
                            Italic, Paragraph, AutoImage, Image,
                            MediaEmbed, Heading,
                            Base64UploadAdapter, Font, BlockQuote, Link, AutoLink,
                            List
                        ],
                    }}
                    data={content} // Set the initial content here
                    onChange={handleEditorChange}
                />
            </Form.Item>

            <Form.Item style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '' }}>
                <Spin spinning={initForm ? update.isLoading : create.isLoading}>
                    <Button type="primary" htmlType="submit">
                        {initForm ? 'Lưu' : 'Tạo mới'}
                    </Button>
                </Spin>
            </Form.Item>
        </Form>
    );
};

export default NotificationForm;
