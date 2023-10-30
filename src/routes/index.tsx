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

const InterestRate = lazy(() => import('@/pages/Contract/active/InterestRate'));
const BlockContract = lazy(() => import('@/pages/Contract/block/BlockContract'));
const SetInterestRate = lazy(() => import('@/pages/InterestRate/SetInterestRate/SetInterestRate'));

const TransactionHistory = lazy(() => import('@/pages/FinancialManagement/transaction-history/TransactionHistory'));

const UserManagement = lazy(() => import('@/pages/UserManagement/UserManagement/UserManagement'));
const Invoice = lazy(() => import('@/pages/Invoice/InvoiceTablePage'));
const InvoiceDetail = lazy(() => import('@/pages/Invoice/InvoiceDetail'));

const Greeting = lazy(() => import('@/pages/Application/Greeting/Greeting'));
const Support = lazy(() => import('@/pages/Application/Support/Support'));

const Notification = lazy(() => import('@/pages/Notification/Notification'));


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
        path: 'signal/recommendations',
        element: <WrapperRouteComponent element={<Recommendations />} titleId="Khuyến nghị" />,
      },
      {
        path: 'signal/create', 
        element: <WrapperRouteComponent element={<CreateSignal />} titleId="Khuyến nghị" />,
      },
      {
        path: '/signal/create-and-approve',
        element: <WrapperRouteComponent element={<ApproveAndCreateSignal />} titleId="Duyệt/ Tạo Khuyến nghị" />,
      },
      // 
      {
        path: 'customer-management/customer-group',
        element: <WrapperRouteComponent element={<GroupList />} titleId="Nhóm khách hàng" />,
      },
      {
        path: 'customer-management/customer-group/detail/:id',
        element: <WrapperRouteComponent element={<GroupDetail />} titleId="Chi tiết nhóm khách hàng" />,
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
        path: '/contract/active',
        element: <WrapperRouteComponent element={<InterestRate />} titleId="Hợp đồng còn hiệu lực" />,
      },
      {
        path: '/contract/block',
        element: <WrapperRouteComponent element={<BlockContract />} titleId="Hợp đồng đã thanh lý" />,
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
        path: '/transaction/invoice/list',
        element: <WrapperRouteComponent element={<Invoice />} titleId="Danh sách chứng từ thanh toán!" />,
      },
      {
        path: '/invoice/detail/:id',
        element: <WrapperRouteComponent element={<InvoiceDetail />} titleId="Danh sách chứng từ thanh toán!" />,
      },
      // 
      {
        path: '/application/greeting',
        element: <WrapperRouteComponent element={<Greeting />} titleId="Thiết lập câu chào" />,
      },
      {
        path: '/application/support',
        element: <WrapperRouteComponent element={<Support />} titleId="Thiết lập liên kết hỗ trợ" />,
      },
      {
        path: '/notification',
        element: <WrapperRouteComponent element={<Notification />} titleId="Thiết lập thông báo" />,
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
