/*
 * @Description: 基础用例库管理——更新用例
 * @Author: yong.li
 * @Date: 2022-02-07 14:30:48
 * @LastEditors: yong.li
 * @LastEditTime: 2023-04-23 09:21:07
 */

import { useState, useEffect } from 'react'
import { Spin, Form, Input, Button, Radio, Tabs, message, UploadFile, TabsProps } from 'antd'
import { useStore, observer } from '@/stores/hook'
import CommonUpload from '@/components/upload/commonUpload'
import QiNiuUpload from '@/components/upload/qiniuUpload'
import api from '@/services/api'
import { Classification, UseCase } from './type'
import GConfig from '@/config/global'
import { useMutation, useQuery } from 'react-query'

interface IProps {
  classifications: Classification[]
  useCase: UseCase
  qiniuToken?: string
  onCallbackParent: () => void
}

interface UpdateParams {
  name: string
  state: string
}

const UpdateUnit = (props: IProps) => {
  const { appStore } = useStore()

  const { classifications, useCase, qiniuToken, onCallbackParent } = props

  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  const [state, setState] = useState<string>(useCase?.state?.id)
  const [fileList, setFileList] = useState<UploadFile[]>(useCase?.changeFiles)

  const qiniuTokenQuery = useQuery({
    queryKey: ['qiniuToken'],
    queryFn: () => appStore.handleGetQiniuToken(),
    enabled: !qiniuToken
  })

  useEffect(() => {
    form.setFieldsValue({
      sourceName: useCase.source?.name,
      classificationName: useCase.classification?.name,
      name: useCase.name,
      version: useCase.version,
      state: useCase.state.id,
      changeFiles: useCase.changeFiles
    })
    setFileList([...useCase.changeFiles])
  }, [useCase, classifications, form])

  const mutation = useMutation({
    mutationFn: async (values: UpdateParams) => {
      const datas = {
        ...values,
        changeFiles: JSON.stringify(
          fileList.map((file: UploadFile) => {
            return { name: file.name, url: file.url }
          })
        )
      }
      const { errcode }: ApiResponse = await api.updateUseCase(useCase.id, datas)
      if (errcode === 0) {
        message.success('更新成功！')

        if (onCallbackParent) {
          onCallbackParent()
        }
        return true
      }
      {
        return false
      }
    }
  })

  // 提交
  // const handleSubmit = async (values: UpdateParams) => {
  //   const datas = {
  //     ...values,
  //     changeFiles: JSON.stringify(
  //       fileList.map((file: UploadFile) => {
  //         return { name: file.name, url: file.url }
  //       })
  //     )
  //   }

  //   setLoading(true)
  //   const { errcode }: ApiResponse = await api.updateUseCase(useCase.id, datas)
  //   setLoading(false)

  //   if (errcode === 0) {
  //     message.success('更新成功！')

  //     if (onCallbackParent) {
  //       onCallbackParent()
  //     }
  //   }
  // }

  // 七牛文件上传回调
  const qiniuUploadCallback = (fileList: UploadFile[]) => {
    setFileList(fileList)
  }

  return (
    <Spin spinning={mutation.isLoading || loading}>
      <Form
        form={form}
        name="update"
        onFinish={mutation.mutateAsync}
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
          state,
          type: GConfig.enum.useCaseUpdateTypes[2]?.value
        }}
      >
        <Form.Item name="sourceName" label="用例来源">
          <Input readOnly bordered={false} />
        </Form.Item>
        <Form.Item name="classificationName" label="用例分类">
          <Input readOnly bordered={false} />
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
        <Form.Item name="version" label="用例版本">
          <Input readOnly bordered={false} />
        </Form.Item>
        <Form.Item name="state" label="用例版本状态">
          <Radio.Group
            onChange={(e) => {
              setState(e.target.value)
            }}
          >
            {GConfig.enum.useCaseStates.length > 0 &&
              GConfig.enum.useCaseStates.map((useCaseState: EnumConfigObj) => {
                return (
                  <Radio key={useCaseState.value} value={useCaseState.value}>
                    {useCaseState.label}
                  </Radio>
                )
              })}
          </Radio.Group>
        </Form.Item>
        <Form.Item name="changeFiles" tooltip={'此项仅提供保存查看功能，无文件解析'} label="变更记录文件">
          <QiNiuUpload
            multiple
            isPreview
            qiniuToken={qiniuToken || qiniuTokenQuery.data || ''}
            defaultFileList={fileList}
            onCallbackParent={qiniuUploadCallback}
            onCallbackLoading={(loading: boolean) => setLoading(loading)}
          />
        </Form.Item>
        <div className="d-drawer-footer-sticky">
          <Button
            type="primary"
            htmlType="submit"
            loading={mutation.isLoading || loading}
            disabled={mutation.isLoading || loading}
          >
            提交
          </Button>
        </div>
      </Form>
    </Spin>
  )
}

/**用例对照表 */
const ContrastUnit = (props: IProps) => {
  const { classifications, useCase, onCallbackParent } = props
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    form.setFieldsValue({
      sourceName: useCase.source?.name,
      classificationName: useCase.classification?.name,
      name: useCase.name || '/',
      version: useCase.version
    })
  }, [useCase, classifications, form])

  // 提交
  const handleSubmit = async (values: { file: UploadFile[] }) => {
    const datas = {
      ...values
    }
    setLoading(true)
    const { errcode }: ApiResponse = await api.updateUseCaseContrast(useCase.id, datas)
    setLoading(false)
    if (errcode === 0) {
      message.success('更新成功！')
      if (onCallbackParent) {
        onCallbackParent()
      }
    }
  }

  // 文件上传回调
  const uploadCallback = (file: UploadFile) => {
    form.setFieldsValue({
      file
    })
  }
  return (
    <Spin spinning={loading}>
      <Form
        form={form}
        name="contrast"
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
      >
        <Form.Item name="sourceName" label="用例来源">
          <Input readOnly bordered={false} />
        </Form.Item>
        <Form.Item name="classificationName" label="用例分类">
          <Input readOnly bordered={false} />
        </Form.Item>
        <Form.Item name="name" label="用例名称">
          <Input readOnly bordered={false} />
        </Form.Item>
        <Form.Item name="version" label="用例版本">
          <Input readOnly bordered={false} />
        </Form.Item>
        <Form.Item name="file" label="用例关系对照文件" rules={[{ required: true, message: '用例关系对照文件！' }]}>
          <CommonUpload
            action={GConfig.uploadTemplateUrl.useCase.up}
            accept=".xlsx"
            tips="支持扩展名：.xlsx"
            onCallbackParent={uploadCallback}
          />
        </Form.Item>
        <div className="d-drawer-footer-sticky">
          <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
            提交
          </Button>
        </div>
      </Form>
    </Spin>
  )
}

const Home = (props: IProps) => {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '用例版本信息',
      children: <UpdateUnit {...props} />
    },
    {
      key: '2',
      label: '用例对照表',
      children: <ContrastUnit {...props} />
    }
  ]

  return (
    <div className="case-lib-update">
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  )
}

export default observer(Home)
