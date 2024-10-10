import { TetrisStore } from './TetrisStore'

const stores = {
  tetrisStore: new TetrisStore(20, 24, 0.08)
}

export const useStores = () => stores
