/*
 * @Description: 七牛文件上传
 * @Author: yong.li
 * @Date: 2022-02-07 15:06:13
 * @LastEditors: yong.li
 * @LastEditTime: 2023-04-18 09:16:01
 */
import React, { useEffect, useState } from 'react'
import { Upload, Button, message, UploadProps, UploadFile } from 'antd'
import { InboxOutlined, UploadOutlined } from '@ant-design/icons'
import { region, upload } from 'qiniu-js'
import dayjs from 'dayjs'
import CustomItem from './customItem'
import { Extra } from './type'
import GConfig from '@/config/global'
import utils from '@/utils'

interface IProps {
  /** 类型 拖拽*/
  type?: string | undefined
  /** 唯一标识（应对同一个页面引用多个组件） */
  uploadId?: string
  /** 过滤文件后缀 */
  accept?: string
  /** 提示 */
  tips?: string
  /** 是否多文件上传 */
  multiple?: boolean
  /** 七牛token */
  qiniuToken: string
  /** 最大文件数 */
  maxCount?: number
  /** 默认文件列表 */
  defaultFileList?: Array<UploadFile>
  /** 回调方法 */
  onCallbackParent?: (files: UploadFile[], uploadId?: string) => void
  /** 回调上传loading */
  onCallbackLoading?: (loading: boolean) => void
  /** 是否开启三方预览 */
  isPreview?: boolean
  /** 是否禁用 */
  disabled?: boolean
}

/**
 * 七牛文件上传公共组件
 * @param props
 * @returns
 */
const UploadUnit: React.FC<IProps> = (porps: IProps) => {
  const {
    type,
    uploadId,
    accept,
    tips,
    multiple = false,
    qiniuToken,
    maxCount = 10,
    defaultFileList,
    onCallbackParent,
    onCallbackLoading,
    isPreview,
    disabled = false
  } = porps
  const [upLoading, setUpLoading] = useState<boolean>(false)
  const [fileLists, setFileLists] = useState<Array<UploadFile>>([])
  useEffect(() => {
    if (defaultFileList && defaultFileList instanceof Array) {
      setFileLists([...defaultFileList])
    }
  }, [defaultFileList])

  // 反馈已上传的文件地址
  const handleOnCallbackParent = async (files: UploadFile[]) => {
    if (onCallbackParent) {
      if (uploadId) {
        onCallbackParent(files, uploadId)
      } else {
        onCallbackParent(files)
      }
    }
  }
  // loading设置
  const handleSetLoading = (loading: boolean) => {
    setUpLoading(loading)
    if (onCallbackLoading) {
      onCallbackLoading(loading)
    }
  }

  // 自定义文件上传
  const customUploadFile = (file: File) => {
    const key = `tct/easywork/${dayjs(new Date()).format('YYYYMMDD')}/${
      dayjs(new Date()).format('HHmmss') + '_' + file.name.replace(/\s/g, '')
    }`
    const config = {
      useCdnDomain: true,
      region: region.z0,
      forceDirect: true // 是否上传全部采用直传方式
    }
    const putExtra: Partial<Extra> = {
      fname: file.name, // 文件原文件名
      mimeType: undefined // 用来限制上传文件类型，为 null 时表示不对文件类型限制；
    }
    return upload(file, key, qiniuToken, putExtra, config)
  }

  // 文件上传配置
  const uploadProps: UploadProps = {
    name: 'file',
    multiple,
    accept,
    maxCount,
    defaultFileList: fileLists, // 默认已上传的文件列表
    fileList: fileLists, // 已经上传的文件列表
    headers: {},
    itemRender: (originNode, file, _fileList, actions) => {
      return <>{isPreview ? <CustomItem file={file} remove={actions.remove} /> : originNode}</>
    },
    customRequest: ({ file, onSuccess }: any) => {
      // 自定义上传（目前采用七牛上传SDK）
      customUploadFile(file).subscribe({
        error: (err) => {
          console.log(`文件上传错误  ${err}`)
          handleSetLoading(false)
          if (err.message.includes('expired token')) {
            message.error('token失效，请刷新页面重试！', 3)
          } else {
            message.error(err.message, 3)
          }
        },
        complete: (e) => {
          // 自定义上传完成（此时antd的fileList并未赋值）
          if (onSuccess) {
            onSuccess(e, file) // 调用onSuccess事件，解决loading一直加载的问题，下一步将执行status为done的onChange方法
          }
        }
      })
    },
    onChange({ file, fileList }) {
      handleSetLoading(true)
      const { status, response } = file
      if (status === 'uploading') {
        setFileLists(fileList)
      }
      if (status === 'done') {
        handleSetLoading(false)
        message.success(`${file.name} 上传成功！`, 1)
        if (response) {
          const newFileLists = fileList
          const newFile = newFileLists.find((s: UploadFile) => s.uid === file.uid)
          if (newFile) {
            newFile.url = `${GConfig.docHost}/${response.key}`
          }

          setFileLists([...newFileLists])

          handleOnCallbackParent([...newFileLists])
        }
      } else if (status === 'error') {
        setFileLists(fileList)
        handleSetLoading(false)
        if (response && response.error === 'expired token') {
          message.error('token失效，请刷新页面重试！', 3)
        } else {
          message.error(response.error, 3)
        }
      }
    },
    beforeUpload(file) {
      handleSetLoading(true)
      const isLt100M = file.size < GConfig.maxUploadSize
      let isUpload = true
      if (!isLt100M) {
        message.error(`上传文件大小不能超过${GConfig.maxUploadSize / 1024 / 1024}M！`)
        handleSetLoading(false)
        isUpload = false
      }
      if (fileLists.length >= maxCount) {
        // message.warning(`上传文件数量不能超过${maxCount}`)
        handleSetLoading(false)
        isUpload = true
      }
      return isUpload
    },
    data(file) {
      return {
        token: qiniuToken,
        key: `tct/easywork/${utils.format.date(new Date(), 'fullTimeToMini')}/${file?.name}`
      }
    },
    onRemove(file) {
      const lists = fileLists
      const index = lists.findIndex((s: UploadFile) => s.uid === file.uid)
      if (index < 0) return
      lists.splice(index, 1)
      setFileLists([...lists])
      // lists.map((list) => {
      //   return newFileList.push({
      //     name: list.name,
      //     url: list.response ? `${GConfig.docHost}/${list.response.key}` : list.url
      //   })
      // })

      if (onCallbackParent) {
        if (uploadId) {
          onCallbackParent(lists, uploadId)
        } else {
          onCallbackParent(lists)
        }
      }
    }
  }

  if (type === 'draggier') {
    return (
      <div>
        <Upload.Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽文件至此区域上传</p>
          <p className="ant-upload-hint">{tips}</p>
        </Upload.Dragger>
      </div>
    )
  }

  return (
    <>
      <Upload {...uploadProps} showUploadList={{ showRemoveIcon: !disabled }}>
        <Button icon={<UploadOutlined />} loading={upLoading} disabled={disabled || upLoading}>
          选择上传文件
        </Button>
        {tips && <div className="d-text-default">{tips}</div>}
      </Upload>
    </>
  )
}

export default UploadUnit
