import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import Root from './routes/Root'
import About from './routes/About'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root/>,
    children: [
      {
        index: true,
        element: <App/>
      },
      {
        path: '/about',
        element: <About/>
      }
    ]
  },

])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)