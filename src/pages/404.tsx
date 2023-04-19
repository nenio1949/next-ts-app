import { Empty } from 'antd'
import { useRouter } from 'next/router'

export default function NoMatch() {
  const router = useRouter()
  const { message } = router.query
  return (
    <div style={{ paddingTop: '5%' }}>
      <Empty description={<span className="d-text-gray">{message || '当前访问路径不存在！'}</span>} />
    </div>
  )
}

NoMatch.noLayout = true
