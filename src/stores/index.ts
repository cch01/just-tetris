import { TetrisStore } from './TetrisStore'

const stores = {
  tetrisStore: new TetrisStore(20, 10, 1)
}

export const useStores = () => stores
