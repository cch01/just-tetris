import { TetrisStore } from './TetrisStore'

const stores = {
  tetrisStore: new TetrisStore(20, 14)
}

export const useStores = () => stores
