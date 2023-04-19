/*
 * @Description:普通文件上传
 * @Author: yong.li
 * @Date: 2022-02-07 15:06:13
 * @LastEditors: yong.li
 * @LastEditTime: 2023-04-18 09:23:48
 */
import React, { ReactNode } from 'react'
import { Upload, message, UploadProps, UploadFile } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import utils from '@/utils'

interface IProps {
  /** 上传地址 */
  action?: string
  /** 提示语 */
  tips?: string
  /** 模板 */
  template?: string
  /** 自定义模板内容 */
  customTemplate?: ReactNode
  /** 是否支持同时多文件上传 */
  multiple?: boolean
  /** 支持文件格式 */
  accept?: string
  /** 是否支持上传文件夹 */
  directory?: boolean
  /** 最大上传文件数 */
  maxCount?: number
  /** 最大上传文件大小，单位MB */
  maxSize?: number
  /** 回调 */
  // eslint-disable-next-line no-unused-vars
  onCallbackParent?: (file: UploadFile) => void
}

const CommonUpload: React.FC<IProps> = (props: IProps) => {
  const {
    tips, // 提示语
    template, // 模板url
    customTemplate, // 自定义模板内容
    accept, // 支持文件格式
    directory = false, // 是否支持上传文件夹
    maxCount = 1, // 最大上传文件数
    // maxSize = 10, // 最大上传文件大小，单位MB
    onCallbackParent // 回调
  } = props

  // 组装上传请求参数
  const uploadProps: UploadProps = {
    name: 'file',
    accept,
    multiple: false,
    directory,
    maxCount,
    showUploadList: true,
    headers: {
      Authorization: `Bearer ${utils.localstorage.get('_USER_INFO')?.accessToken}`
    },
    beforeUpload(file) {
      let isUpload = false
      // 单位M
      let limitSize
      if (file.name.includes('.docx')) {
        limitSize = 100
      } else {
        limitSize = 10
      }
      const isOver = file.size > limitSize * 1024 * 1024
      // word类不能超过100
      if (isOver) {
        isUpload = false
        message.error(`文件最大不能超过 ${limitSize}MB!`, 1)
        return Upload.LIST_IGNORE
      } else {
        if (onCallbackParent) {
          onCallbackParent(file)
        }
      }
      return isUpload
    }
  }

  return (
    <>
      <div style={{ marginBottom: 15, textAlign: 'center' }}>
        {customTemplate ||
          (template && (
            <div>
              请根据提供的模板填入正确的内容，点击
              <a href={template} target="_blank" rel="noreferrer" download="数据表上传模板">
                下载模板
              </a>
              。
            </div>
          ))}
      </div>
      <div>
        <Upload.Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件至此区域上传</p>
          <p className="ant-upload-hint">{tips}</p>
        </Upload.Dragger>
      </div>
    </>
  )
}

export default CommonUpload
