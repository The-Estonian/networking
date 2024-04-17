import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Container from './items/RootContainer/Container';
import ErrorPage from './items/RootContainer/ErrorPage';
import Profile from './items/Profile/Profile';
import Posts from './items/Posts/Posts';

import './index.css';
const router = createBrowserRouter([
  {
    path: '/',
    element: <Container />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/posts',
        element: <Posts />,
      },
      {
        path: '/groups',
        element: <div>GROUPS GO HERE TO-DO</div>,
      },
      {
        path: '/chat',
        element: <div>CHAT GO HERE TO-DO</div>,
      },
      {
        path: '/followers',
        element: <div>FOLLOWERS GO HERE TO-DO</div>,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
