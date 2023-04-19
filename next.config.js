/** @type {import('next').NextConfig} */
const path = require('path')

module.exports = {
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  // distDir: 'dist', // 自定义构建目录
  sassOptions: {
    // sass样式目录
    includePaths: [path.join(__dirname, './src/assets/css')]
  },
  async rewrites() {
    // 重写请求地址以应对跨域
    return [
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_SERVER_HOST + '/api/:path*'
      }
    ]
  }
}
