import enumConfig, { EnumConfig } from './enum'
import packageJson from '../../package.json'

interface IGConfig {
  serverHost?: string
  docHost: string
  filePreviewServiceHost: string
  uploadQiNiuUrl: string
  manualUrl: string
  system: {
    name: string
    logoUrl: string
    version: {
      code: string
      name?: string
    }
  }
  maxUploadSize: number
  enum: EnumConfig
  uploadTemplateUrl: {
    useCase: {
      up: string
      down: string
    }
  }
  formItemLayout: {
    labelCol: {
      span: number
    }
    wrapperCol: {
      span: number
    }
  }
}

const GConfig: IGConfig = {
  serverHost: process.env.NEXT_PUBLIC_SERVER_HOST,
  docHost: 'http://docs.cq-tct.com', // 文件存储服务地址
  filePreviewServiceHost: 'http://fps.funenc.xyz:2112', // 文件预览服务地址
  uploadQiNiuUrl: 'https://upload.qiniup.com', // 七牛上传地址
  manualUrl: 'https://www.yuque.com/mu2e9y/qk2tny', // 操作手册地址
  system: {
    name: '富能通nextjs模板项目',
    logoUrl: 'http://docs.antjob.ink/tct/logo/en-full.png?imageView2/2/h/60',
    version: {
      code: packageJson.version,
      name: process.env.NEXT_PUBLIC_SYSTEM_VERSION
    }
  },
  maxUploadSize: 104857600, // 文件上传最大限制100MB
  enum: enumConfig, // 枚举值
  uploadTemplateUrl: {
    useCase: {
      /* 用例库文件 */
      up: '/api/web/measure/upload',
      down: 'https://www.yuque.com/mu2e9y/vvm8dg/ewf95a'
    }
  },
  formItemLayout: {
    // form表单空格设置
    labelCol: {
      span: 4
    },
    wrapperCol: {
      span: 19
    }
  }
}

export default GConfig
