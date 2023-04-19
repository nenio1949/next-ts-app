import { Empty } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { ReactNode } from 'react'

interface IProps {
  type?: string
  mode?: string
  data?: ReactNode
  style?: React.CSSProperties
}

const Home = (props: IProps) => {
  const { type, data, mode = 'result', style = {} } = props
  let marginTop: string | number = 0

  switch (type) {
    case 'loading':
      marginTop = 0
      break
    case 'tips':
      marginTop = '5%'
      break
    default:
      break
  }

  return (
    <div style={{ marginTop, ...style }}>
      {mode === 'result' ? (
        <Empty description={<span className="d-text-gray">{data}</span>} />
      ) : (
        <div className="d-text-gray" style={{ textAlign: 'center' }}>
          <LoadingOutlined /> {data}
        </div>
      )}
    </div>
  )
}

export default Home
