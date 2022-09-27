import React from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
import NotFound from './pages/404'
import Home from './pages/home'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <NotFound />,
  },
]);

const Router = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default Router