import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Container from "./items/Container"
import ErrorPage from "./items/ErrorPage"
import Profile from "./items/Profile"
import Posts from "./items/Posts"

import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Container />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/profile',
        element: <Profile />,
      },
      {
        path: '/posts',
        element: <Posts />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
