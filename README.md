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
│   │   ├── warning.tsx
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

## 环境变量配置
先在vite-env.d.ts中声明变量，然后再.env.[development|test|production]中配置

  - development: 开发环境
  - test: 测试环境
  - production: 生产环境

使用: process.env.[环境变量]  参考公共配置`global.ts`

查看文档：https://cn.vitejs.dev/guide/env-and-mode.html

## 接口访问代理
若后端未进行跨域处理，可修改`next.config.js`文件中修改source、 destination实现跨域访问

## 命名
文件及文件夹命名统一采用小驼峰，组件名称统一采用大驼峰

## 格式校验
所有参数必须先声明再使用，严禁参数声明使用any，遵循eslint+prettier校验规则，使用`yarn lint`命令可以校验是否合规，请在代码提交前检查代码规范性，保证团队高效写作及高可维护性