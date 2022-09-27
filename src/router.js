import React from 'react'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import NotFoundPage from './pages/404'
import HomePage from './pages/home'
import JoinPage from './pages/join';

const router = createBrowserRouter([
  /* Join a room Page */
  {
    path: '/join',
    element: <JoinPage />,
  },

  /* Home Page */
  {
    path: "/",
    element: <HomePage />,
    errorElement: <NotFoundPage />,
  },
]);

const Router = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default Router