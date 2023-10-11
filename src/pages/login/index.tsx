import type { LoginParams } from '@/interface/user/login';
import type { FC } from 'react';
import {useState} from 'react'
import './index.less';

import { Avatar, Button, Checkbox, Form, Input, notification, Space, Spin, Typography } from 'antd';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { LocaleFormatter, useLocale } from '@/locales';
import { formatSearch } from '@/utils/formatSearch';

import logo from '../../assets/header/logo.png';
import { loginAsync } from '../../stores/user.action';

const initialValues: LoginParams = {
  email: '',
  password: '',
  // remember: true
};

const LoginForm: FC = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { formatMessage } = useLocale();

  const onFinished = async (form: LoginParams) => {
    if(loading) return
    setLoading(true)
    const res: any = await dispatch(await loginAsync(form));

    if (res.success) {
      const search = formatSearch(location.search);
      const from = search.from || { pathname: '/' };

      notification.success({
        message: res.message,
      });
      navigate(from);
    } else {
      notification.error({
        message: res.message,
      });
    }
    setLoading(false)
  };

  return (
    <div className="login-page">
      <Form<LoginParams> onFinish={onFinished} className="login-page-form" initialValues={initialValues}>
        <Space size="large" style={{ marginBottom: '20px', width: '100%' }}>
          <Avatar src={logo} size="large" />
          <Typography.Title level={2} style={{ margin: '0' }}>
            FILA ADMIN
          </Typography.Title>
        </Space>
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: formatMessage({
                id: 'gloabal.tips.enterUsernameMessage',
              }),
            },
          ]}
        >
          <Input
          type='email'
            placeholder={formatMessage({
              id: 'gloabal.tips.username',
            })}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: formatMessage({
                id: 'gloabal.tips.enterPasswordMessage',
              }),
            },
          ]}
        >
          <Input.Password
            placeholder={formatMessage({
              id: 'gloabal.tips.password',
            })}
          />
        </Form.Item>
        {/* <Form.Item name="remember" valuePropName="checked">
          <Checkbox>
            <LocaleFormatter id="gloabal.tips.rememberUser" />
          </Checkbox>
        </Form.Item> */}
        <Form.Item>
          <Button htmlType="submit" type="primary" className="login-page-form_button">
            {loading ? <Spin size="small" />: <LocaleFormatter id="gloabal.tips.login" />}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;