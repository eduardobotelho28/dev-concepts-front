import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { API_URL } from './config/env'
import { createBrowserRouter, RouterProvider } from "react-router-dom"

import Home from './pages/Home/Home'
import RootLayout from './layouts/RootLayout'
import ConceptList from './pages/ConceptList'
import ConceptDetail from './pages/ConceptDetail'
import ErrorPage from './pages/ErrorPage/ErrorPage'
import HiddenLogin from './pages/HiddenLogin/HiddenLogin'
import ProtectedRoute from './components/ProtectedRoute'
import AdminNewPost from './pages/AdminNewPost/AdminNewPost'

const router = createBrowserRouter([

  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,

    children: [
      { index: true, element: <Home /> },

      // {
      //   path: "concepts",
      //   element: <ConceptsList />,
      //   // loader roda antes de renderizar; recebe a URL com os query params
      //   loader: async ({ request }) => {
      //     const url = new URL(request.url);
      //     const tag = url.searchParams.get("tag");
      //     const q = url.searchParams.get("q");
      //     return fetchConcepts({ tag, q }); // sua função de API
      //   },
      // },

      // {
      //   path: "concept/:id",
      //   element: <ConceptDetail />,
      //   loader: async ({ params }) => fetchConceptById(params.id),
      // },

      { path: "admin-portal", element: <HiddenLogin /> },

      {
        path: "admin",
        element: <ProtectedRoute />,
        children: [
          // { index: true, element: <AdminDashboard /> },
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
