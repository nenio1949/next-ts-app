import Image from 'next/image'
import WelcomeImg from '@/assets/img/welcome.png'
import utils from '@/utils'

const Home = () => {
  utils.operate.setDocumentTitle('欢迎页')

  return (
    <div className="d-container" style={{ height: '100%', backgroundColor: '#ffffff' }}>
      <div className="d-container-body" style={{ textAlign: 'center' }}>
        <Image src={WelcomeImg} height={300} alt="" />
        <div style={{ padding: 5, fontSize: 20 }}>欢迎访问用户权益管理平台</div>
      </div>
    </div>
  )
}

export default Home
