/*
 * @Description: 登录
 * @Author: yong.li
 * @Date: 2023-04-17 13:52:13
 * @LastEditors: yong.li
 * @LastEditTime: 2023-04-18 14:55:24
 */

import { useEffect, useState } from 'react'
import { Form, Input, Button, Checkbox, message } from 'antd'
import Router, { useRouter } from 'next/router'
import Image from 'next/image'
import api from '@/services/api'
import utils from '@/utils'
import GConfig from '@/config/global'

interface FormData {
  remember: boolean
  login: string
  password: string
}

interface CheckboxChangeEvent {
  target: {
    checked: boolean
  }
}

export default function Home() {
  const router = useRouter()
  // 状态控制
  const [form] = Form.useForm()
  const [fouceType, setFouceType] = useState<string>()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const { token, refresh_token } = router.query

    if (token && refresh_token && typeof token === 'string' && typeof refresh_token === 'string') {
      handleCheckLoginAuth({ token, refresh_token })
    } else {
      setLoading(false)
    }
  }, [])

  // 校验是否有免登陆权限
  const handleCheckLoginAuth = async (search: { [key: string]: string }) => {
    if (search) {
      const token = search.token
      const refreshToken = search.refresh_token
      if (token && refreshToken) {
        const accessToken = token
        await utils.localstorage.set('_USER_INFO', { accessToken, refreshToken })
        const { errcode, data }: ApiResponse = await api.getUser()
        await utils.localstorage.set('_USER_INFO', { accessToken, refreshToken, ...data })
        if (errcode === 0) {
          Router.push({ pathname: '/' })
        }
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    // 是否记住账号密码
    const isRemember = utils.localstorage.get('_REMEMBER_LOGIN')
    if (isRemember) {
      const loginInfo = utils.localstorage.get('_LOGIN_INFO')
      form.setFieldsValue({
        remember: isRemember,
        login: loginInfo?.login,
        password: loginInfo?.password
      })
    } else {
      form.setFieldsValue({
        remember: isRemember
      })
    }
  }, [form])

  // 登录处理
  const handleLogin = async (values: FormData) => {
    setLoading(true)
    if (values.remember) {
      // 加密缓存登录信息
      utils.localstorage.set('_LOGIN_INFO', {
        login: values.login,
        password: values.password
      })
    } else {
      utils.localstorage.remove('_LOGIN_INFO')
    }

    const { errcode, data }: ApiResponse = await api.login(values)
    setLoading(false)

    // 登录成功并跳转
    if (errcode === 0) {
      // 加密缓存用户信息
      utils.localstorage.set('_USER_INFO', data)

      // 缓存并加密权限码
      // const encryptStr = GConG_ENCRYPT(user.Auths);
      // utils.localstorage.set('_USER_AUTHCODE', encryptStr, );

      message.success('欢迎回来，登录成功！', 1)

      Router.push({ pathname: '/' })
    }
  }

  const handleFouce = (type: string) => {
    setFouceType(type)
  }

  // 忘记密码
  const handleForgot = () => {
    Router.push({ pathname: '/reset-password' })
  }

  // 记住登录变化
  const handleRememberChange = (e: CheckboxChangeEvent) => {
    utils.localstorage.set('_REMEMBER_LOGIN', e?.target?.checked || false)
  }

  return (
    <>
      <div className="d-login">
        <div className="d-login-container">
          <div className="d-login-left">
            <Image
              width={220}
              height={500}
              className="d-login-bg-1"
              src="https://docs.cq-tct.com/funenc/metrics.svg"
              alt=""
            />
            <Image
              width={420}
              height={500}
              className="d-login-bg-2"
              src="https://docs.cq-tct.com/funenc/mobile_login.svg"
              alt=""
            />
            <Image
              width={1000}
              height={500}
              className="d-login-bg-3"
              src="https://docs.cq-tct.com/funenc/two_factor_authentication.svg"
              alt=""
            />
          </div>
          <div className="d-login-right-bg" />
          <div className="d-login-right">
            <div className="d-login-title">欢迎登录</div>
            <div className="d-login-sub-title">{GConfig.system.name}</div>
            <div className="d-login-form">
              <Form
                form={form}
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={handleLogin}
              >
                <div
                  className="d-login-form-item"
                  style={{
                    borderColor: fouceType === 'login' ? '#C4C0D9' : '#F3F3F3'
                  }}
                >
                  <span>输入账号</span>
                  <Form.Item name="login" rules={[{ required: true, message: '请输入合法的登录账号！' }]}>
                    <Input allowClear placeholder="请输入登录账号" size="large" onFocus={() => handleFouce('login')} />
                  </Form.Item>
                </div>
                <div
                  className="d-login-form-item"
                  style={{
                    borderColor: fouceType === 'password' ? '#C4C0D9' : '#F3F3F3'
                  }}
                >
                  <span>输入密码</span>
                  <Form.Item name="password" rules={[{ required: true, message: '请输入合法的登录密码！' }]}>
                    <Input.Password
                      allowClear
                      placeholder="请输入登录密码"
                      size="large"
                      onFocus={() => handleFouce('password')}
                    />
                  </Form.Item>
                </div>

                <Form.Item style={{ marginTop: 15 }}>
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox onChange={handleRememberChange}>记住我</Checkbox>
                  </Form.Item>

                  <a className="login-form-forgot" onClick={handleForgot} href="#!">
                    忘记密码？
                  </a>
                </Form.Item>

                <Form.Item>
                  <Button type="primary" loading={loading} disabled={loading} htmlType="submit" block size="large">
                    立即登录
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

Home.noLayout = true
