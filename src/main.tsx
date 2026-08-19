import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

// document.getElementById('root')!：找到 index.html 里的 <div id="root"></div>，
// ! 表示断言这个元素一定存在
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)