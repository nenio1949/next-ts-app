import React, { ReactElement } from 'react'
import type { AppProps } from 'next/app'
import zhCN from 'antd/locale/zh_CN'
import { ConfigProvider } from 'antd'
import stores from '@/stores'
import type { NextPage } from 'next'
import StoreContext from '@/stores/context'
import Layout from '@/components/layout'
import { QueryClientProvider, QueryClient } from 'react-query'
import '@/assets/css/app.scss'
import 'antd/dist/reset.css'

type NextPageWithLayout = NextPage & {
  noLayout?: boolean
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.noLayout ? (page: ReactElement) => page : (page: ReactElement) => <Layout>{page}</Layout>
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false // 关闭窗口焦点影响数据刷新
      }
    }
  })
  return (
    <ConfigProvider locale={zhCN}>
      <QueryClientProvider client={queryClient}>
        <StoreContext.Provider value={stores}>{getLayout(<Component {...pageProps} />)}</StoreContext.Provider>
      </QueryClientProvider>
    </ConfigProvider>
  )
}
