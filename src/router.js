import React from 'react'
import {
  createBrowserRouter,
  HashRouter,
  RouterProvider,
} from "react-router-dom";
import NotFoundPage from './pages/404'
import HomePage from './pages/home'
import JoinPage from './pages/join';
import RoomPage from './pages/room';

const router = createBrowserRouter([
  /* Join a room Page */
  {
    path: '/r/:room',
    element: <RoomPage />,
  },

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
    <HashRouter>
      <RouterProvider router={router} />
    </HashRouter>
  )
}

export default Router