import { useContext } from 'react'
import StoreContext from './context'
import { observer } from 'mobx-react-lite'

function useStore() {
  const store = useContext(StoreContext)
  return store
}

export { observer, useStore }
