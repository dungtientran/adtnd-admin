import type { FC } from 'react';
import type { RouteObject } from 'react-router';

import { lazy } from 'react';
import { Navigate } from 'react-router';
import { useRoutes } from 'react-router-dom';

import Dashboard from '@/pages/dashboard';
import LayoutPage from '@/pages/layout';
import LoginPage from '@/pages/login';

import WrapperRouteComponent from './config';
// not Found
const NotFound = lazy(() => import(/* webpackChunkName: "404'"*/ '@/pages/404'));

// Product Management

const ListOfStocks = lazy(() => import('@/pages/ProductManagement/ListOfStocks/ListOfStocks'));
const ServicePack = lazy(() => import('@/pages/ProductManagement/ServicePack/ServicePack'));
const Recommendations = lazy(() => import('@/pages/ProductManagement/Recommendations/Recommendations'));


const routeList: RouteObject[] = [
  {
    path: '/login',
    element: <WrapperRouteComponent element={<LoginPage />} titleId="title.login" />,
  },
  {
    path: '/',
    element: <WrapperRouteComponent element={<LayoutPage />} auth={true} titleId="" />,
    children: [
      {
        path: '',
        element: <Navigate to="dashboard" />,
      },
      {
        path: 'dashboard',
        element: <WrapperRouteComponent element={<Dashboard />} titleId="title.dashboard" />,
      },
      // product management
      {
        path: 'product-managament/list-of-stocks',
        element: <WrapperRouteComponent element={<ListOfStocks />} titleId="Danh mục cổ phiếu" />,
      },
      {
        path: 'product-managament/service-pack',
        element: <WrapperRouteComponent element={<ServicePack />} titleId="Gói dịch vụ" />,
      },
      {
        path: 'product-managament/recommendations',
        element: <WrapperRouteComponent element={<Recommendations />} titleId="Khuyến nghị" />,
      },
      {
        path: '*',
        element: <WrapperRouteComponent element={<NotFound />} titleId="title.notFount" />,
      },
    ],
  },
];

const RenderRouter: FC = () => {
  const element = useRoutes(routeList);

  return element;
};

export default RenderRouter;
