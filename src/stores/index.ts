import { TetrisStore } from './TetrisStore'

const stores = {
  tetrisStore: new TetrisStore(20, 10, 0.5)
}

export const useStores = () => stores
