import { useState, useEffect, Fragment } from 'react'
import { useStore, observer } from '@/stores/hook'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { map as _map, groupBy as _groupBy } from 'lodash'
import { Avatar, Dropdown, Button, Modal, Row, Col, message, Tooltip, Image } from 'antd'
import api from '@/services/api'
import WarningUnit from '@/components/warning'
import Router from 'next/router'
import GConfig from '@/config/global'
import utils from '@/utils'

interface ProjectHash {
  [key: string]: Array<Project>
}

interface IStates {
  visible: boolean
  appLoading: boolean
  projects: Project[]
  projectHashs: {
    [key: string]: Array<Project>
  }
  selectedProject: Project | null
}

const Header = () => {
  const { appStore } = useStore()
  const [state, setState] = useState<IStates>({
    visible: false,
    appLoading: false,
    projects: [], // 所有项目
    projectHashs: {}, // 所有项目
    selectedProject: null // 已选择的项目
  })
  const [open, setOpen] = useState(false)
  const userInfo = utils.localstorage.get('_USER_INFO')

  useEffect(() => {
    handleInit()
  }, [])

  /** 初始化 */
  const handleInit = () => {
    const currentSelectedProject = utils.localstorage.get('_SELECTED_PROJECT')
    if (currentSelectedProject) {
      setState((prev) => {
        return { ...prev, selectedProject: currentSelectedProject }
      })
      handleUserAuths(currentSelectedProject.id)
    }
    handleCheckLogin()
    handleGetProjects()
  }

  // 检查是否登录
  const handleCheckLogin = () => {
    const userInfo = utils.localstorage.get('_USER_INFO')
    if (!userInfo || !userInfo.accessToken) {
      message.error('登录失效！')
      Router.push({ pathname: '/login' })
    }
  }

  // 获取当前人员权限
  const handleUserAuths = async (projectId: number) => {
    const { errcode, data }: ApiResponse = await api.getUserAuthorities({ project_id: projectId })
    if (errcode === 0) {
      utils.localstorage.set('_USER_AUTHCODE', data)
    }
  }

  // 获取所有项目
  const handleGetProjects = async () => {
    setState((prev) => {
      return { ...prev, appLoading: true }
    })
    const projects = await appStore.handleGetProjects(true)
    // 只显示工程类项目
    const initProjectHashs = _groupBy(
      projects.filter((s: Project) => s.subType?.id === 'engineering'),
      (o) => o.region
    )
    const orderedProjectHashs: ProjectHash = {}
    Object.keys(initProjectHashs)
      .sort((a, b) => a.localeCompare(b))
      .forEach((key) => {
        orderedProjectHashs[key] = initProjectHashs[key]
      })
    setState((prev) => {
      return {
        ...prev,
        appLoading: false,
        projects: projects || [],
        projectHashs: orderedProjectHashs
      }
    })
  }

  // 跳转登录页
  const handleJumpToLogin = () => {
    utils.localstorage.clear()
    Router.push({ pathname: '/login' })
  }

  // 选择项目
  const handleSelectedProject = async (project: Project) => {
    const { selectedProject } = state
    if (!selectedProject || (selectedProject && project && project.id !== selectedProject.id)) {
      appStore.handleChangeSelectedProject(project)
      message.success(`已切换至：${project.name}`, 1)
      await appStore.handleAppLoading()
      setState((prev) => {
        return { ...prev, selectedProject: project, visible: false }
      })
    } else {
      message.warning('已在此项目不建议切换', 1)
    }
  }

  /** 跳转页面 */
  const handleJumpToPage = (path: string) => {
    Router.push({ pathname: path })
  }

  /** 模态框显示隐藏切换 */
  const handleSwitchVisible = () => {
    setState((prev) => {
      return { ...prev, visible: !state.visible }
    })
  }

  // 跳转
  const handlePushPage = (path: string) => {
    Router.push({ pathname: path })
  }

  const userInfoDOMs = () => {
    return (
      <>
        <div className="d-header-panel">
          {userInfo?.avatar ? (
            <Avatar
              size={64}
              src={userInfo?.avatar}
              style={{ color: '#f56a00', backgroundColor: '#fde3cf', marginBottom: 10 }}
            />
          ) : (
            <Avatar
              size={64}
              src={userInfo?.avatar || userInfo?.name?.slice(0, 1) || 'F'}
              style={{ color: '#f56a00', backgroundColor: '#fde3cf', marginBottom: 10 }}
            />
          )}
          <ul>
            <li>
              <strong>{userInfo?.name}</strong>
            </li>
            <li>
              <Button onClick={() => handleJumpToPage('/change-password')} type="text" block>
                修改密码
              </Button>
            </li>
            <li>
              <Button onClick={() => handleJumpToPage('/apply-change-mobile')} type="text" block>
                变更手机号
              </Button>
            </li>
            <li>
              <Button
                onClick={() => {
                  setOpen(true)
                }}
                type="link"
                danger
                block
              >
                退出
              </Button>
            </li>
          </ul>
        </div>
        <Modal
          title="确定要退出本次登录吗？"
          open={open}
          onOk={handleJumpToLogin}
          onCancel={() => {
            setOpen(false)
          }}
          okText="确认"
          cancelText="取消"
        >
          <p>退出后需要重新登录</p>
        </Modal>
      </>
    )
  }

  return (
    <>
      <div className="d-header">
        <div className="d-header-left" onClick={() => handlePushPage('/')}>
          <span className="d-logo">
            <Image src={GConfig.system.logoUrl} alt="logo" preview={false} />
          </span>
          <span className="d-header-title" onClick={() => handleJumpToPage.bind('/welcome')}>
            {GConfig.system.name}
          </span>
          <span className="d-header-company">{GConfig.system.version.name}</span>
        </div>

        <div className="d-header-right-box">
          <ul>
            <li className="d-header-project">
              <span style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
                <>
                  {state.selectedProject?.region && (
                    <span style={{ opacity: 0.5 }}>{state.selectedProject?.region} · </span>
                  )}
                  {state.selectedProject?.name || '请选择归属项目'}
                </>
              </span>
              <span className="d-header-link-orange" onClick={handleSwitchVisible}>
                【切换】
              </span>
            </li>
            <li style={{ marginLeft: 5 }}>
              <Tooltip title="查看操作手册" placement="bottom">
                <a href={GConfig.manualUrl} target="view_window" className="d-header-button-icon">
                  <QuestionCircleOutlined style={{ fontSize: 18, fontWeight: 600 }} />
                </a>
              </Tooltip>
            </li>
            <li className="d-header-user">
              <Dropdown dropdownRender={userInfoDOMs} placement="bottomRight">
                <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  {userInfo ? (
                    <Avatar
                      size="small"
                      src={userInfo?.avatar}
                      style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
                    />
                  ) : (
                    <Avatar size="small" style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                      {'F'}
                    </Avatar>
                  )}
                  <div className="d-name">{userInfo ? userInfo.name.slice(0, 1) : '同学'}</div>
                </div>
              </Dropdown>
            </li>
          </ul>
        </div>
        <Modal
          title={`当前选中项目【${state.selectedProject?.name || '暂未选择'}】`}
          footer={null}
          width={800}
          open={state.visible}
          onCancel={handleSwitchVisible}
        >
          <div style={{ minHeight: 300 }}>
            {!state.appLoading && state.projects.length === 0 && (
              <WarningUnit data="当前无任何可选项目" style={{ paddingTop: '10%' }} />
            )}

            {state.appLoading && (
              <WarningUnit mode="loading" data="数据加载中..." style={{ paddingTop: '15%', fontSize: 18 }} />
            )}

            {!state.appLoading && state.projects.length > 0 && (
              <>
                {_map(state.projectHashs, (projects, company) => {
                  return (
                    <Fragment key={company}>
                      <div className="d-header-project-title">
                        {company}
                        <small>（{projects.length}）</small>
                      </div>
                      <Row>
                        {projects
                          .concat([])
                          .sort((a: Project, b: Project) => a.name.localeCompare(b.name))
                          .map((project: Project) => {
                            return (
                              <Col
                                key={project.id}
                                span={8}
                                onClick={() => handleSelectedProject(project)}
                                className={`d-header-project-item d-link ${
                                  project.id === state.selectedProject?.id && 'd-project-selected'
                                }`}
                              >
                                {project.name}
                              </Col>
                            )
                          })}
                      </Row>
                    </Fragment>
                  )
                })}
              </>
            )}
          </div>
        </Modal>
      </div>
    </>
  )
}

export default observer(Header)
