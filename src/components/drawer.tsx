/*
 * @Description: 公用抽屉
 * @Author: yong.li
 * @Date: 2023-03-07 16:34:08
 * @LastEditors: yong.li
 * @LastEditTime: 2023-03-07 16:34:28
 */

import React, { useState, useEffect, ReactNode } from 'react'
import { Drawer } from 'antd'

interface IProps {
  /** 标题 */
  title?: ReactNode
  /** 是否显示 */
  isOpen?: boolean
  /** 宽度 */
  width?: string | number
  /** 底部内容 */
  footer?: ReactNode
  /** 主体内容 */
  children?: ReactNode
  /** 回调方法 */
  callbackParent?: () => void
}

const Home: React.FC<IProps> = (props: IProps) => {
  const { title, isOpen, width, footer, children, callbackParent } = props
  const [open, setOpen] = useState(isOpen)
  const onClose = () => {
    setOpen(false)
    if (callbackParent) callbackParent()
  }
  useEffect(() => {
    setOpen(isOpen)
  }, [isOpen])

  return (
    <>
      <Drawer
        width={width || '60%'}
        title={title}
        placement="right"
        onClose={onClose}
        open={open}
        footer={footer}
        destroyOnClose
      >
        {children}
      </Drawer>
    </>
  )
}

export default Home
