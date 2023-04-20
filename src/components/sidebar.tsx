import React, { useEffect, useState } from 'react'
import { Layout, Menu, Button } from 'antd'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'
import menuData from '@/config/menu'
import Router, { useRouter } from 'next/router'
import utils from '@/utils'

const { Sider } = Layout

const SideBar = () => {
  const router = useRouter()

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false) // 是否收起
  const [openKeys, setOpenKeys] = useState<string[]>(['/' + router.pathname.split('/')[1]])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])

  // 处理菜单折叠
  const handleMenuCollapsed = () => {
    const currentValue = !isCollapsed

    utils.localstorage.set('_MENU_STATUS', currentValue)

    setIsCollapsed(currentValue)
  }

  const handleClick = (key: string) => {
    console.log('🚀 ~ file: sidebar.tsx:27 ~ handleClick ~ key:', key)

    if (key) {
      Router.push({ pathname: key })
      setSelectedKeys([key])
    }
  }

  useEffect(() => {
    const openKey = '/' + router.pathname.split('/')[1]
    console.log('🚀 ~ file: sidebar.tsx:37 ~ useEffect ~ openKey:', openKey)
    setOpenKeys([openKey])
    setSelectedKeys([router.pathname])

    const menuStatus = utils.localstorage.get('_MENU_STATUS')
    setIsCollapsed(menuStatus)
  }, [router.pathname])

  return (
    <div className="d-sidebar">
      <Menu
        mode="inline"
        items={menuData}
        defaultOpenKeys={openKeys}
        defaultSelectedKeys={selectedKeys}
        selectedKeys={selectedKeys}
        onClick={({ key }) => handleClick(key)}
        inlineCollapsed={isCollapsed}
      />
      <div className="d-sidebar-collapse">
        <Button type="text" block onClick={handleMenuCollapsed} style={{ padding: '2px 0' }}>
          {React.createElement(isCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
        </Button>
      </div>
    </div>
  )
}

export default SideBar
