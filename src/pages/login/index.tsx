import type { LoginParams } from '@/interface/user/login';
import type { FC } from 'react';

import './index.less';

import { ArrowLeftOutlined, RollbackOutlined, SwapLeftOutlined } from '@ant-design/icons';
import { Avatar, Button, Checkbox, Form, Input, notification, Space, Spin, Typography } from 'antd';
import { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { changeFirstLoginApi } from '@/api/ttd_change_pw_first_login';
import { LocaleFormatter, useLocale } from '@/locales';
import { formatSearch } from '@/utils/formatSearch';

import logo from '../../assets/header/logo.png';
import { loginAsync } from '../../stores/user.action';

const initialValues: LoginParams = {
  email: '',
  password: '',
  // remember: true
};

const passwordValidator = (value: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.\[\]{}\(\)?\-"!@#%&/,><\':;|_~`])\S{7,99}$/;

  if (value.match(passwordRegex)) {
    return true;
  }

  return false;
};

const LoginForm: FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { formatMessage } = useLocale();
  const [firstLogin, setFirstLogin] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [session, setSession] = useState<string>('');

  const onFinished = async (form: LoginParams) => {
    // if (loading) return;
    setLoading(true);

    if (firstLogin) {
      const newValues = {
        ...form,
        email,
        session,
      };
      const res = await changeFirstLoginApi(newValues);

      if (res?.code === 200) {
        setFirstLogin(false);
        notification.success({
          message: res?.message,
        });
      }

      // console.log('newValues____________________________', newValues);
      // console.log('res____________________________________', res);
    } else {
      const res: any = await dispatch(await loginAsync(form));

      // console.log('ress________________________________', res);

      if (res?.success) {
        const search = formatSearch(location.search);
        const from = search.from || { pathname: '/' };

        notification.success({
          message: res.message,
        });
        navigate(from);
      } else if (res?.isFirtLogin) {
        setFirstLogin(true);
        setEmail(res?.email);
        setSession(res?.Session);
      } else {
        notification.error({
          message: res?.message,
        });
      }
    }

    setLoading(false);
  };

  return (
    <div className="login-page">
      <Form<LoginParams> onFinish={onFinished} className="login-page-form" initialValues={initialValues}>
        {firstLogin && (
          <Button onClick={() => setFirstLogin(false)} size="small">
            <ArrowLeftOutlined />{' '}
          </Button>
        )}
        <Space size="large" style={{ marginBottom: '20px', width: '100%' }}>
          <Avatar src={logo} size="large" />
          {!firstLogin ? (
            <h1 className="title_login">FILA ADMIN</h1>
          ) : (
            <p>Thay đổi mật khẩu khi bạn đăng nhập lần đầu</p>
          )}
        </Space>
        {!firstLogin ? (
          <Fragment>
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
                type="email"
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
          </Fragment>
        ) : (
          <Fragment>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập Mật khẩu!',
                },
                {
                  validator(_, value) {
                    if (!value || passwordValidator(value)) {
                      return Promise.resolve();
                    }

                    return Promise.reject(
                      new Error(
                        'Mật khẩu tối thiểu 8 ký tự và phải có ít nhất 1 chữ số, 1 chữ cái in hoa và 1 kí tự đặc biệt',
                      ),
                    );
                  },
                },
              ]}
              hasFeedback
            >
              <Input.Password placeholder="Mật khẩu" />
            </Form.Item>

            <Form.Item
              name="new_password"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập lại mật khẩu!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }

                    return Promise.reject(new Error('Mật khẩu không trùng!'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Nhập lại mật khẩu" />
            </Form.Item>
          </Fragment>
        )}

        <Form.Item>
          <Spin spinning={loading}>
            <Button htmlType="submit" type="primary" className="login-page-form_button">
              {/* {loading ? <Spin size="small" /> : <LocaleFormatter id="gloabal.tips.login" />} */}
              {firstLogin ? 'Lưu' : 'Login'}
            </Button>
          </Spin>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
