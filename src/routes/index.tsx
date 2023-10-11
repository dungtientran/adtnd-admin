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
const NotFound = lazy(() => import('@/pages/404'));

// Product Management

const ListOfStocks = lazy(() => import('@/pages/ProductManagement/ListOfStocks/ListOfStocks'));
const CreateSignal = lazy(() => import('@/pages/Signal/CreateSignal'));
const ApproveAndCreateSignal = lazy(() => import('@/pages/Signal/ApproveAndCreateSignal'));
const ServicePack = lazy(() => import('@/pages/ProductManagement/ServicePack/ServicePack'));
const Recommendations = lazy(() => import('@/pages/ProductManagement/Recommendations/Recommendations'));
const GroupList = lazy(() => import('@/pages/Group/GroupTablePage'));
const GroupDetail = lazy(() => import('@/pages/Group/GroupDetailPage'));

const CustomerGroup = lazy(() => import('@/pages/CustomerManagement/CustomerGroup/CustomerGroup'));
const ListCustomers = lazy(() => import('@/pages/CustomerManagement/ListCustomers/ListCustomers'));
const ListRequests = lazy(() => import('@/pages/CustomerManagement/ListRequests/ListRequests'));

const InterestRate = lazy(() => import('@/pages/InterestRate/InterestRate/InterestRate'));
const SetInterestRate = lazy(() => import('@/pages/InterestRate/SetInterestRate/SetInterestRate'));

const TransactionHistory = lazy(() => import('@/pages/FinancialManagement/transaction-history/TransactionHistory'));

const UserManagement = lazy(() => import('@/pages/UserManagement/UserManagement/UserManagement'));


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
        path: 'signal/create',
        element: <WrapperRouteComponent element={<CreateSignal />} titleId="Khuyến nghị" />,
      },
      {
        path: 'signal/create-and-approve',
        element: <WrapperRouteComponent element={<ApproveAndCreateSignal />} titleId="Duyệt/ Tạo Khuyến nghị" />,
      },
      // 
      {
        path: 'customer-management/customer-group',
        element: <WrapperRouteComponent element={<GroupList />} titleId="Nhóm khách hàng" />,
      },
      {
        path: 'customer-management/customer-group/detail/:id',
        element: <WrapperRouteComponent element={<GroupDetail />} titleId="Nhóm khách hàng" />,
      },
      {
        path: 'customer-management/list-customer',
        element: <WrapperRouteComponent element={<ListCustomers />} titleId="Danh sách khách hàng" />,
      },
      {
        path: 'customer-management/list-request',
        element: <WrapperRouteComponent element={<ListRequests />} titleId="Danh sách yêu cầu" />,
      },
      // 
      {
        path: '/interest-rate/set-interest-rate',
        element: <WrapperRouteComponent element={<SetInterestRate />} titleId="Thiết lập hoa hồng" />,
      },
      {
        path: '/interest-rate/interest-rate',
        element: <WrapperRouteComponent element={<InterestRate />} titleId="Thiết lập hoa hồng" />,
      },
      // 
      {
        path: '/transaction/transaction-history',
        element: <WrapperRouteComponent element={<TransactionHistory />} titleId="Lịch sử giao dịch" />,
      },
      // 
      {
        path: '/user-management/list',
        element: <WrapperRouteComponent element={<UserManagement />} titleId="Danh sách quản trị viên" />,
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
