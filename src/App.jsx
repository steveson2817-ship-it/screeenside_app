import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { ContentProvider } from './components/ContentContext.jsx'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Learn from './pages/Learn.jsx'
import LessonPage from './pages/LessonPage.jsx'
import Safety from './pages/Safety.jsx'
import Quest from './pages/Quest.jsx'
import Chat from './pages/Chat.jsx'
import Help from './pages/Help.jsx'
import Privacy from './pages/Privacy.jsx'
import Admin from './pages/Admin.jsx'
import NotFound from './pages/NotFound.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ContentProvider>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/learn/:lessonId" element={<LessonPage />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/cyberquest" element={<Quest />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/help" element={<Help />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </ContentProvider>
    </BrowserRouter>
  )
}
