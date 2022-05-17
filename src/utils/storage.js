/**
 * 存储localStorage
 */
 export const setLStore = (name, content) => {
    if (!name) return
    if (typeof content !== 'string') {
      content = JSON.stringify(content)
    }
    window.localStorage.setItem(name, content)
  }
  
  /**
   * 获取localStorage
   */
  export const getLStore = name => {
    if (!name) return
    return window.localStorage.getItem(name)
  }
  
  /**
   * 删除localStorage
   */
  export const removeLStore = name => {
    if (!name) return
    window.localStorage.removeItem(name)
  }

  /**
 * 存储localStorage
 */
 export const setStore = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.sessionStorage.setItem(name, content)
}

/**
 * 获取localStorage
 */
export const getStore = name => {
  if (!name) return
  return window.sessionStorage.getItem(name)
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
  if (!name) return
  window.sessionStorage.removeItem(name)
}
  
  