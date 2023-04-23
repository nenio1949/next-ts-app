/*
 * @Description: 基础用例库管理
 * @Author: yong.li
 * @Date: 2022-02-07 14:23:27
 * @LastEditors: yong.li
 * @LastEditTime: 2023-04-23 09:02:21
 */
import React, { useState, useEffect, ReactNode } from 'react'
import { Table, Button, Tag, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import dynamic from 'next/dynamic'
import api from '@/services/api'
import { useStore, observer } from '@/stores/hook'
import { DisabledStateText, UseCase, IStates } from './type'
import { useQuery } from 'react-query'
import utils from '@/utils'
import Router from 'next/router'

const QueryFilterUnit = dynamic(import('./queryFilter'), { ssr: false })
const DrawerUnit = dynamic(import('@/components/drawer'))
const CreateUnit = dynamic(import('./create'))
const UpdateUnit = dynamic(import('./update'))
// 禁用状态
const disabledStateText: DisabledStateText = {
  natural: <Tag color="success">正常</Tag>,
  abandoned: <Tag color="error">废弃</Tag>,
  other: <Tag color="default">其他</Tag>,
  generating: <Tag color="default">用例生成中</Tag>
}

const Home = () => {
  const { appStore } = useStore()

  const { baseUseCase: hasOperateAuth } = utils.operate.getUserModuleGroupAuth(['baseUseCase'])

  const [state, setState] = useState<IStates>({
    selectedKeys: [],
    visible: false,
    loading: false,
    hasOperateAuth: hasOperateAuth,
    columns: [],
    pagination: {
      // 分页
      showTotal: (total: number) => {
        return `共${total}条`
      }, // 显示总数
      showQuickJumper: true, // 快速跳转至某页
      current: 1, // 当前页
      pageSize: 10, // 每页显示条数
      total: 0, // 总数
      showSizeChanger: true // 是否展示pageSize切换器
    },
    condition: {
      count: 1,
      state: ['natural', 'generating'],
      source: '',
      name: '',
      classification_id: null
    },
    subDrawer: {
      title: '',
      width: '60%',
      component: null
    }
  })

  const classificationsQuery = useQuery({
    queryKey: ['classifications'],
    queryFn: () => appStore.handleGetConfigurations('classifications')
  })

  const qiniuTokenQuery = useQuery({
    queryKey: ['qiniuToken'],
    queryFn: () => appStore.handleGetQiniuToken()
  })

  const {
    isLoading,
    data: useCases,
    refetch
  } = useQuery({
    queryKey: ['useCases', { condition: state.condition }], // 查询依赖condition变量
    queryFn: () => handleGetPageDatas()
  })

  /** 勾选变化 */
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setState((prevState) => {
      return { ...prevState, selectedKeys: [...newSelectedRowKeys] }
    })
  }

  // 设置Columns
  const handleSetColumns = () => {
    const { loading, hasOperateAuth } = state

    const columns: ColumnsType<UseCase> = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: 62,
        render: (text, record, index) => handleTableIndex(index)
      },
      {
        title: '来源',
        width: 100,
        dataIndex: 'source',
        key: 'source',
        render: (text) => {
          return text?.name || '/'
        }
      },
      {
        title: '分类',
        dataIndex: 'classification',
        key: 'classification',
        render: (text) => {
          return text?.name || '/'
        }
      },
      {
        title: '用例名称',
        dataIndex: 'name',
        key: 'name',
        render: (text) => {
          return text || '/'
        }
      },
      {
        title: '版本号',
        dataIndex: 'version',
        key: 'version',
        render: (text, record) => {
          return <a onClick={() => handleOperate('detail', record)}>{text || '/'}</a>
        }
      },
      {
        title: '用例数量',
        dataIndex: 'nums',
        key: 'nums',
        render: (text) => {
          return text || 0
        }
      },
      {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        render: (text) => {
          return disabledStateText[text.id] || '/'
        }
      },
      {
        title: '上传人',
        dataIndex: 'user',
        key: 'user',
        render: (text) => {
          return text?.name || '/'
        }
      },
      {
        title: '上传时间',
        dataIndex: 'time',
        key: 'time',
        render: (text) => {
          return utils.format.date(text) || '/'
        }
      },
      {
        title: '操作',
        dataIndex: 'options',
        key: 'options',
        render: (text, record) => {
          if (record.state.id === 'generating') {
            return '/'
          }
          const items: MenuProps['items'] = [
            {
              key: '0',
              label: (
                <Button disabled={loading} type="link" size="small" onClick={() => handleDownload('useCase', record)}>
                  下载用例
                </Button>
              )
            },
            {
              key: '1',
              label: (
                <Button disabled={loading} type="link" size="small" onClick={() => handleDownload('contrast', record)}>
                  下载对照表
                </Button>
              )
            }
          ]
          const optionsDoms = (
            <>
              {hasOperateAuth && (
                <Button type="link" size="small" disabled={loading} onClick={() => handleOperate('update', record)}>
                  更新
                </Button>
              )}
              {record.contrast?.url && (
                <>
                  <a
                    href={`/show/preview-file?fileUrl=${record.contrast?.url}`}
                    target="_blank"
                    rel="noreferrer"
                    title={record.contrast?.name}
                  >
                    预览对照表
                  </a>
                </>
              )}
              <Dropdown menu={{ items }}>
                <Button disabled={loading} type="link" size="small">
                  下载
                </Button>
              </Dropdown>
            </>
          )
          return optionsDoms || '/'
        }
      }
    ]
    setState((prev) => {
      return { ...prev, columns }
    })
  }

  // 获取分页数据
  const handleGetPageDatas = async () => {
    const { condition, pagination } = state

    const requestData = {
      state: JSON.stringify(condition.state),
      source: condition.source,
      name: condition.name,
      classification_id: condition.classification_id ? JSON.stringify(condition.classification_id) : null,
      size: pagination.pageSize,
      page: pagination.current
    }

    setState((prev) => {
      return { ...prev, loading: true }
    })
    const { errcode, data }: ApiResponse = await api.getUseCases(requestData)
    if (errcode === 0) {
      const newPagination = { ...pagination, total: data.nums }
      setState((prev) => {
        return {
          ...prev,
          loading: false,
          pagination: newPagination,
          visible: false,
          subDrawer: {
            title: '',
            width: '60%',
            component: null
          }
        }
      })
      return data.template
    } else {
      setState((prev) => {
        return { ...prev, loading: false }
      })
      return []
    }
  }

  useEffect(() => {
    utils.operate.setDocumentTitle('基础用例库管理')
    handleSetColumns()
  }, [])

  // 操作
  const handleOperate = async (type?: string, record?: UseCase) => {
    switch (type) {
      case 'create':
        setState((prev) => {
          return {
            ...prev,
            visible: true,
            subDrawer: {
              title: '新增用例',
              width: '60%',
              component: (
                <CreateUnit
                  classifications={classificationsQuery.data || []}
                  qiniuToken={qiniuTokenQuery.data}
                  onCallbackParent={refetch}
                />
              )
            }
          }
        })
        break
      case 'update':
        if (record) {
          setState((prev) => {
            return {
              ...prev,
              visible: true,
              subDrawer: {
                title: '更新用例',
                width: '60%',
                component: (
                  <UpdateUnit
                    useCase={record}
                    classifications={classificationsQuery.data || []}
                    onCallbackParent={refetch}
                  />
                )
              }
            }
          })
        }
        break
      case 'detail':
        Router.push({ pathname: `/useCase/${record?.id}` })
        break
      default:
        setState((prev) => {
          return {
            ...prev,
            visible: false,
            subDrawer: {
              title: '',
              width: '60%',
              component: null
            }
          }
        })
        break
    }
  }

  /**
   * 下载
   */
  const handleDownload = async (type: string, record: UseCase) => {
    setState((prev) => {
      return { ...prev, loading: true }
    })

    const { errcode, data }: ApiResponse =
      type === 'useCase' ? await api.downloadUseCase(record.id) : await api.downloadUseCaseContrast(record.id)
    setState((prev) => {
      return { ...prev, loading: false }
    })
    const rename = type === 'useCase' ? `【用例】${record?.name}.docx` : `【对照表】${data?.name}`
    if (errcode === 0) {
      const dateTime = new Date()
      const timeout = new Date(dateTime.setDate(dateTime.getDate() + 1)).getTime()
      open(`${data.url}?e=${timeout}&token=${qiniuTokenQuery.data}&attname=${rename}`, '_self')
    }
  }

  // 分页、排序、筛选变化
  const handleTableChange = (pagination: TablePaginationConfig, extraAction: string) => {
    if (extraAction === 'paginate') {
      const { condition } = state
      //  分页
      setState((prev) => {
        return {
          ...prev,
          condition: { ...condition, count: condition.count + 1 },
          pagination: {
            ...pagination,
            showTotal: (total: number) => {
              return `共${total}条`
            }
          }
        }
      })
    }
  }

  // 表格分页序号处理
  const handleTableIndex = (index: number) => {
    const { pagination } = state
    if (pagination.current && pagination.pageSize) {
      return `${(pagination.current - 1) * pagination.pageSize + (index + 1)}`
    }
  }

  return (
    <>
      <div className="d-greeting">
        <div className="d-greeting-content">
          <QueryFilterUnit
            loading={state.loading}
            hasOperateAuth={state.hasOperateAuth}
            setSelectedKeys={(keys: React.Key[]) => {
              setState((prev) => {
                return { ...prev, selectedKeys: keys }
              })
            }}
            handleOperate={handleOperate}
            selectedKeys={state.selectedKeys}
            classifications={classificationsQuery.data || []}
            condition={state.condition}
            onCallbackParent={(condition) => {
              setState((prev) => {
                return { ...prev, condition, pagination: { ...prev.pagination, current: 1 } }
              })
            }}
          />
        </div>
      </div>
      <Table
        rowSelection={{
          preserveSelectedRowKeys: true,
          selectedRowKeys: state.selectedKeys,
          hideSelectAll: true,
          onChange: onSelectChange
        }}
        className="d-table-center-container"
        columns={state.columns}
        dataSource={useCases}
        rowKey={(record) => record.id}
        loading={isLoading}
        bordered
        pagination={state.pagination}
        onChange={(pagination, filters, sorter, extra) => handleTableChange(pagination, extra.action)}
      />
      <DrawerUnit
        title={state.subDrawer.title}
        isOpen={state.visible}
        width={state.subDrawer.width}
        callbackParent={() => handleOperate('close')}
      >
        {state.subDrawer.component}
      </DrawerUnit>
    </>
  )
}

export default observer(Home)
