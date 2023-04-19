/*
 * @Description: 基于antd、axios的请求处理
 * @Author: yong.li
 * @Date: 2023-03-06 15:06:57
 * @LastEditors: yong.li
 * @LastEditTime: 2023-04-18 15:37:50
 */

import axios, { AxiosRequestConfig } from 'axios'
import { message } from 'antd'
import Router from 'next/router'
import { forOwn as _forOwn, remove, findLast } from 'lodash'
import utils from '@/utils'
import GConfig from '@/config/global'

const baseWaitTime = 100 // 默认的等待时间100毫秒

const requestURLRate: Array<unknown> = [] // 如：{ api: '/api/standardRoles', timestamp: 1596597701181 }

interface RemoveParams {
  api: string
  timestamp: number
}

interface FindLastParams {
  api: string
}

export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'post'
  | 'POST'
  | 'put'
  | 'PUT'
  | 'patch'
  | 'PATCH'
  | 'purge'
  | 'PURGE'
  | 'link'
  | 'LINK'
  | 'unlink'
  | 'UNLINK'

/**
 * 请求出入口
 * @param {*} api 地址
 * @param {*} method 方法，默认为GET
 * @param {*} params 参数，默认为空对象
 * @param {*} maxRequestCycleCount 最大请求频次（与baseWaitTime结合），默认为1
 * @param {*} serverHost 接口主机地址
 * @param {*} headers 传入头部信息，默认为空对象
 */
// eslint-disable-next-line max-params
export default async function axiosRequest(
  api: string,
  method: Method = 'GET',
  params: object | null = {},
  headers: any = { 'Content-Type': 'application/json' },
  serverHost?: string,
  maxRequestCycleCount = 1
) {
  // 针对非GET请求进行限流拦截
  if (method !== 'GET') {
    const nowTimestamp = new Date().getTime() // 当前时间戳

    // 去除当前接口指定周期外的数据
    remove(requestURLRate, (o: unknown) => {
      const pre = o as RemoveParams
      return pre.api === api && pre.timestamp < nowTimestamp - maxRequestCycleCount * baseWaitTime
    })

    // 获取上一次请求信息（一般同周期只有一个，防止处理意外）
    const hasRequestURLRate = findLast(requestURLRate, (o: unknown) => (o as FindLastParams).api === api)

    if (hasRequestURLRate) {
      message.warning('当前访问的频次过高，请适当放慢手速！', 1)

      // 为了保持数据完整性，返回数据与接口定义一致
      const res: ApiResponse = {
        errcode: -100,
        msg: '',
        data: null
      }
      return res
    }
    requestURLRate.push({
      api,
      timestamp: new Date().getTime()
    })
  }

  return new Promise<ApiResponse>((resolve, reject) => {
    const { accessToken } = utils.localstorage.get('_USER_INFO')

    const formData = new FormData()

    if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      // 遍历对象转换为formdata对象
      _forOwn(params, (value: string, key: string) => {
        formData.append(key, value)
      })
    }

    const sendData: AxiosRequestConfig = {
      // baseURL: serverHost ?? GConfig.serverHost,
      method,
      headers: {
        ...headers,
        authorization: `Bearer ${accessToken}`
      },
      url: api,
      params: method === 'GET' ? params : {},
      data: headers['Content-Type'] === 'application/x-www-form-urlencoded' ? formData : params
    }

    axios(sendData)
      .then(async (res) => {
        const response: ApiResponse = res.data
        const { errcode, msg } = response
        if (errcode !== 0) {
          message.error(msg)

          // 直接跳转到登录页面（简单粗暴）
          if (errcode === 401) {
            Router.push({ pathname: '/login' })
          }
        }

        resolve(response)
      })
      .catch(async (error) => {
        if (error) {
          message.error('服务端发生逻辑错误！', 1)
        }
        reject(error)
      })
  })
}
