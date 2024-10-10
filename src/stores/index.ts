import { TetrisStore } from './TetrisStore'

const stores = {
  tetrisStore: new TetrisStore(20, 10, 10)
}

export const useStores = () => stores
