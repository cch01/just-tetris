export const getLocalStorageNumber = (key: string, fallback: number) => {
  const storedValue = localStorage.getItem(key)
  return storedValue ? parseInt(storedValue) : fallback
}
