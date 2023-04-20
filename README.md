# next-ts-app

使用技术包括nextjs、react、mobx、sass、antd、axios,使用eslint、prettier格式化代码

## 打包与运行

yarn install
运行：yarn dev
打包：yarn build
运行打包后的代码：yarn start
## 目录结构

```
├── Dockerfile                                                                # docker配置
├── README.md                                                                 # 项目说明
├── next-env.d.ts                                                             
├── next.config.js                                                            # next配置
├── nginx
├── package.json                                                              # 项目依赖
├── public                                                                    # 公共静态内容
│   ├── favicon.ico
│   ├── next.svg
│   └── vercel.svg
├── src
│   ├── assets                                                                # 静态资源
│   │   ├── css                                                                 # 样式
│   │   └── img                                                                 # 图片
│   ├── components                                                            # 公共组件
│   │   ├── drawer.tsx
│   │   ├── header.tsx
│   │   ├── layout.tsx
│   │   ├── sidebar.tsx
│   │   └── upload
│   ├── config                                                                # 公共配置
│   │   ├── enum.ts
│   │   ├── global.ts
│   │   ├── menu.tsx
│   │   ├── moduleGroupAuthCode.ts
│   │   └── types.d.ts
│   ├── pages                                                                 # 页面
│   │   ├── 404.tsx
│   │   ├── _app.tsx                                                          # 入口页面
│   │   ├── _document.tsx
│   │   ├── common
│   │   ├── index.tsx                                                         # 首页
│   │   ├── laboratoryTest
│   │   ├── login.tsx
│   │   └── useCase
│   ├── services                                                              # 接口配置及数据请求
│   │   ├── api.ts
│   │   └── request.ts
│   ├── stores                                                                # mobx状态管理
│   │   ├── app.ts
│   │   ├── context.ts
│   │   ├── hook.ts
│   │   └── index.ts
│   └── utils                                                                 # 实用方法
│       ├── format.ts
│       ├── index.ts
│       ├── localstorage.ts
│       ├── operate.ts
│       └── validate.ts
├── tsconfig.json
└── yarn.lock
```

