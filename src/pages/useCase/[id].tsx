import { useRouter } from 'next/router'

const Home = () => {
  const router = useRouter()
  const { id } = router.query
  return (
    <>
      <div>当前数据的id：{id}</div>
    </>
  )
}

export default Home
