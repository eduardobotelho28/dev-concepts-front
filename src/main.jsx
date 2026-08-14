import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { API_URL } from './config/env'
import { createBrowserRouter, RouterProvider } from "react-router-dom"

import Home from './pages/Home/Home'
import RootLayout from './layouts/RootLayout'
import ConceptsList from './pages/ConceptList/ConceptList'
import ConceptDetail from './pages/ConceptDetail/ConceptDetail'
import ErrorPage from './pages/ErrorPage/ErrorPage'
import HiddenLogin from './pages/HiddenLogin/HiddenLogin'
import ProtectedRoute from './components/ProtectedRoute'
import AdminNewPost from './pages/AdminNewPost/AdminNewPost'
import AdminDashBoard from './pages/AdminDashBoard/AdminDashBoard'

const router = createBrowserRouter([

  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,

    children: [
      { index: true, element: <Home /> },

      {
        path: "concepts",
        element: <ConceptsList />,
      },

      {
        path: "concept/:slug",
        element: <ConceptDetail />,
      },

      { path: "admin-portal", element: <HiddenLogin /> },

      {
        path: "admin",
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <AdminDashBoard /> },
          { path: "new", element: <AdminNewPost /> },
        ],
      },

    ],
  },

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
