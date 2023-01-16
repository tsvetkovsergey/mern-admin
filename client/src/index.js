import React from 'react';
import ReactDOM from 'react-dom/client';
import { configureStore } from '@reduxjs/toolkit';
import globalReducer from 'state';
import { Provider } from 'react-redux';
import {
  createBrowserRouter,
  useNavigate,
  RouterProvider,
} from 'react-router-dom';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from 'state/api';

import './index.css';
import App from 'App';
import Dashboard from 'scenes/dashboard';
import Products from 'scenes/products';
import Customers from 'scenes/customers';
import Transactions from 'scenes/transactions';
import Geography from 'scenes/geography';
import Overview from 'scenes/overview';
import Daily from 'scenes/daily';
import Monthly from 'scenes/monthly';
import Breakdown from 'scenes/breakdown';
import Admin from 'scenes/admin';
import Performance from 'scenes/performance';

// React Router
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'products',
        element: <Products />,
      },
      {
        path: 'customers',
        element: <Customers />,
      },
      {
        path: 'transactions',
        element: <Transactions />,
      },
      {
        path: 'geography',
        element: <Geography />,
      },
      {
        path: 'overview',
        element: <Overview />,
      },
      {
        path: 'daily',
        element: <Daily />,
      },
      {
        path: 'monthly',
        element: <Monthly />,
      },
      {
        path: 'breakdown',
        element: <Breakdown />,
      },
      {
        path: 'admin',
        element: <Admin />,
      },
      {
        path: 'performance',
        element: <Performance />,
      },
    ],
  },
]);

// Redux Store
const store = configureStore({
  reducer: {
    global: globalReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefault) => getDefault().concat(api.middleware),
});
setupListeners(store.dispatch);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
