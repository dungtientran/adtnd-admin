import type { LoginParams } from '@/interface/user/login';
import type { FC } from 'react';

import './index.less';

import { ArrowLeftOutlined, RollbackOutlined, SwapLeftOutlined } from '@ant-design/icons';
import { Avatar, Button, Checkbox, Form, Input, notification, Space, Spin, Typography } from 'antd';
import bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';
import { Fragment, useEffect, useState } from 'react';
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
  remember: false,
};

const passwordValidator = (value: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\^$*.\[\]{}\(\)?\-"!@#%&/,><\':;|_~`])\S{7,99}$/;

  if (value.match(passwordRegex)) {
    return true;
  }

  return false;
};

const encryptCredentials = (email: string, password: string) => {
  const encryptedUsername = CryptoJS.AES.encrypt(email, 'DungTran_DEVELOPER').toString();
  const encryptedPassword = CryptoJS.AES.encrypt(password, 'DungTran_DEVELOPER').toString();

  localStorage.setItem('_g', JSON.stringify({ _n: encryptedUsername, _p: encryptedPassword }));
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
  const [form] = Form.useForm();

  const onFinished = async (form: any) => {
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
    } else {
      const res: any = await dispatch(await loginAsync(form));

      if (res?.success) {
        const search = formatSearch(location.search);
        const from = search.from || { pathname: '/' };

        if (form.remember) {
          encryptCredentials(form.username, form.password);
        } else {
          localStorage.removeItem('_g');
        }

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

  useEffect(() => {
    const _g = localStorage.getItem('_g');

    if (_g) {
      const { _n, _p } = JSON.parse(_g);
      const decryptedUsername = CryptoJS.AES.decrypt(_n, 'DungTran_DEVELOPER').toString(CryptoJS.enc.Utf8);
      const decryptedPassword = CryptoJS.AES.decrypt(_p, 'DungTran_DEVELOPER').toString(CryptoJS.enc.Utf8);

      form.setFieldsValue({
        remember: true,
        password: decryptedPassword,
        username: decryptedUsername,
      });
    }
  }, []);

  return (
    <div className="login-page">
      <Form<LoginParams>
        onFinish={onFinished}
        className="login-page-form"
        //  initialValues={initForm}
        form={form}
      >
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
            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>
                <LocaleFormatter id="gloabal.tips.rememberUser" />
              </Checkbox>
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
