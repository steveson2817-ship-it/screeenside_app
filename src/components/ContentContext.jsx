import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { defaultContent } from '../content/index.js'
import { fetchContent } from '../lib/api.js'

const ContentContext = createContext({
  content: defaultContent,
  status: 'loading',
  reload: () => {},
  applyContent: () => {},
})

export function ContentProvider({ children }) {
  const [content, setContent] = useState(defaultContent)
  const [status, setStatus] = useState('loading')

  const reload = useCallback(async () => {
    try {
      const next = await fetchContent()
      setContent(next)
      setStatus('ready')
    } catch {
      // The built-in copy keeps every page usable if the API is briefly unavailable.
      setContent(defaultContent)
      setStatus('offline')
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  return (
    <ContentContext.Provider value={{ content, status, reload, applyContent: setContent }}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  return useContext(ContentContext)
}
