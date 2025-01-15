export const useLocalStorage = () => {
  const getItem = (key: string) => {
    try {
      const itemStr = window.localStorage.getItem(key)
      return itemStr ? JSON.parse(itemStr) : null
    } catch (error) {
      console.error('Error getting item from local storage:', error)
      return null
    }
  }

  const setItem = (key: string, value: any) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error setting item in local storage:', error)
    }
  }

  const removeItem = (key: string) => {
    window.localStorage.removeItem(key)
  }

  return { getItem, setItem, removeItem }
}
