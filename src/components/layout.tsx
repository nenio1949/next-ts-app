import { Layout } from 'antd'
import { useStore, observer } from '@/stores/hook'
import WarningUnit from '@/pages/common/warning'
import dynamic from 'next/dynamic'
// import HeaderUnit from './header'
import SidebarUnit from './sidebar'
import React, { ReactNode } from 'react'

const { Header, Content } = Layout

const HeaderUnit = dynamic(() => import('./header'), { ssr: false })

interface ILayout {
  children: ReactNode
}

const AppLayout = ({ children }: ILayout) => {
  const { appStore } = useStore()
  if (appStore.appLoading) {
    return <WarningUnit mode="loading" data="科技向善，数据为先" style={{ fontSize: 24, paddingTop: '20%' }} />
  }
  return (
    <>
      <Layout className="d-layout">
        <Header className="d-layout-header-container">{typeof window !== undefined && <HeaderUnit />}</Header>
        <Content className="d-layout-body-container">
          <div className="d-layout-body-container-left">
            <SidebarUnit />
          </div>
          <div className="d-layout-body-container-right">
            <Content>{children}</Content>
          </div>
        </Content>
      </Layout>
    </>
  )
}

export default observer(AppLayout)
