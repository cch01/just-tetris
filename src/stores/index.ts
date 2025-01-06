import { TetrisStore } from './TetrisStore'

const stores = {
  tetrisStore: new TetrisStore(20, 16, 10)
}

export const useStores = () => stores
