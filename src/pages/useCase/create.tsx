/*
 * @Description: 基础用例库管理——新增用例
 * @Author: yong.li
 * @Date: 2022-02-07 14:30:11
 * @LastEditors: yong.li
 * @LastEditTime: 2023-04-19 11:27:56
 */

import { useEffect, useState } from 'react'
import { Spin, Form, Input, Button, Select, Radio, message, Alert, UploadFile } from 'antd'
import { useStore, observer } from '@/stores/hook'
import QiNiuUpload from '@/components/upload/qiniuUpload'
import api from '@/services/api'
import dayjs from 'dayjs'
import { region, upload } from 'qiniu-js'
import UseCaseUpload from '@/components/upload/useCaseUpload'
import { Classification } from './type'
import { Extra } from '@/components/upload/type'
import { EnumConfigObj } from '@/config/enum'
import GConfig from '@/config/global'

const { Option } = Select

interface IPorps {
  classifications: Classification[]
  onCallbackParent: () => void
}

interface FormParams {
  source: string
  classificationId: string | number
  name: string
  version: string
  file: UploadFile[]
  changeFiles: UploadFile[]
}

const Home = (props: IPorps) => {
  const { appStore } = useStore()

  const { classifications, onCallbackParent } = props
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const [classificationId, setClassificationId] = useState<number>()
  const [qiniuToken, setQiniuToken] = useState<string>('')
  const [fileList, setFileList] = useState<UploadFile[]>([])
  // 用例文件
  const [useCaseFileList, setUseCaseFileList] = useState<UploadFile[]>([])
  const [isGenerateFile, setIsGenerateFile] = useState<boolean>(false)
  // 获取当前是否存在文件解析任务（后端文件解析只能单线程）
  const getTaskProcess = async () => {
    const { errcode, data }: ApiResponse = await api.getTaskProcess()
    if (errcode === 0) {
      setIsGenerateFile(data?.generateFile)
    }
  }
  // 获取七牛token
  const handleGetQiniuToken = async () => {
    const token = await appStore.handleGetQiniuToken()
    if (token) {
      setQiniuToken(token)
    }
  }
  useEffect(() => {
    getTaskProcess()
    handleGetQiniuToken()

    if (classifications && classifications.length > 0) {
      setClassificationId(classifications?.find((s: Classification) => s.default)?.id || classifications[0]?.id)
    }
  }, [])

  // 自定义文件上传
  const customUploadFile = (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
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
  // 提交
  const handleSubmit = async (values: FormParams) => {
    const file = values.file[0]
    setLoading(true)
    if (file && file.originFileObj) {
      customUploadFile(file.originFileObj).subscribe({
        error: (err) => {
          if (err.message === 'expired token') {
            message.error('token失效，请刷新页面重试！', 3)
          } else {
            message.error(err.message, 3)
          }
          setLoading(false)
        },
        complete: async (e) => {
          const changeFiles = fileList.map((file) => {
            return { name: file.name, url: file.url }
          })
          const file = `${GConfig.docHost}/${e.key}`
          const parma = { ...values }
          const datas = {
            ...parma,
            file,
            changeFiles
          }
          const { errcode, msg }: ApiResponse = await api.createUseCase(datas)
          if (errcode === 0) {
            message.success({ content: msg, duration: 3 })
            if (onCallbackParent) {
              onCallbackParent()
            }
          }
          setLoading(false)
        }
      })
    }
  }
  // 七牛文件上传回调
  const qiniuUploadCallback = (fileList: UploadFile[]) => {
    setFileList(fileList)
  }
  return (
    <Spin spinning={loading}>
      {isGenerateFile && <Alert message="存在未完成的用例库文件解析任务，请稍后再新增！" type="warning" />}
      <Form
        form={form}
        name="create"
        onFinish={handleSubmit}
        scrollToFirstError
        {...{
          labelCol: {
            span: 5
          },
          wrapperCol: {
            span: 18
          }
        }}
        initialValues={{
          source: GConfig.enum.useCaseSources[0].value,
          classificationId
        }}
      >
        <Form.Item name="source" label="用例来源" rules={[{ required: true, message: '请选择用例来源！' }]}>
          <Radio.Group>
            {GConfig.enum.useCaseSources.length > 0 &&
              GConfig.enum.useCaseSources.map((useCaseSource: EnumConfigObj) => {
                return (
                  <Radio value={useCaseSource.value} key={useCaseSource.value}>
                    {useCaseSource.label}
                  </Radio>
                )
              })}
          </Radio.Group>
        </Form.Item>
        <Form.Item name="classificationId" label="用例分类" rules={[{ required: true, message: '请选择用例分类！' }]}>
          <Select
            showSearch
            optionFilterProp="children"
            placeholder="请选择用例分类"
            onChange={(value) => {
              setClassificationId(value)
            }}
          >
            {classifications &&
              classifications.length > 0 &&
              classifications.map((classification: Classification) => {
                return (
                  <Option key={classification.id} value={classification.id}>
                    {classification.name}
                  </Option>
                )
              })}
          </Select>
        </Form.Item>
        <Form.Item
          name="name"
          label="用例名称"
          rules={[
            {
              required: true,
              message: '请输入用例名称！'
            }
          ]}
        >
          <Input allowClear maxLength={20} showCount placeholder="请输入用例名称" />
        </Form.Item>
        <Form.Item name="version" label="用例版本" rules={[{ required: true, message: '请输入用例版本！' }]}>
          <Input allowClear maxLength={20} showCount placeholder="请输入用例版本（如V1.0,V1.1,V2.0,V2.1）" />
        </Form.Item>
        <Form.Item name="file" label="用例库文件" rules={[{ required: true, message: '请上传用例库文件！' }]}>
          <UseCaseUpload useCaseFileList={useCaseFileList} setUseCaseFileList={setUseCaseFileList} />
        </Form.Item>
        <Form.Item name="changeFiles" tooltip={'此项仅提供保存查看功能，无文件解析'} label="变更记录文件">
          <QiNiuUpload
            multiple
            qiniuToken={qiniuToken}
            defaultFileList={fileList}
            onCallbackParent={(files) => qiniuUploadCallback(files)}
            onCallbackLoading={(loading: boolean) => setLoading(loading)}
          />
        </Form.Item>
        <div className="d-drawer-footer-sticky">
          <Button type="primary" htmlType="submit" loading={loading} disabled={loading || isGenerateFile}>
            提交
          </Button>
        </div>
      </Form>
    </Spin>
  )
}
export default observer(Home)
