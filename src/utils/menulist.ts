import type { MenuList } from '@/interface/layout/menu.interface';

export const menuListHandle: MenuList = [
  {
    code: 'dashboard',
    icon: 'dashboard',
    label: { zh_CN: '首页', en_US: 'Dashboard' },
    path: '/dashboard',
  },
  {
    code: 'sanpham',
    icon: 'documentation',
    label: {
      en_US: 'Quản lý sản phẩm',
      zh_CN: '文档',
    },
    path: '/documentation',
    children: [
      {
        code: 'list-of-stocks',
        label: {
          en_US: 'Danh mục cổ phiếu',
          zh_CN: '基本',
        },
        path: '/product-managament/list-of-stocks',
      },
      {
        code: 'service-pack',
        label: {
          en_US: 'Gói dịch vụ',
          zh_CN: '基本',
        },
        path: '/product-managament/service-pack',
      },
    ],
  },
  {
    code: 'khachhang',
    icon: 'documentation',
    label: {
      en_US: 'Quản lý khách hàng',
      zh_CN: '文档',
    },
    path: '/documentation',
    children: [
      {
        code: 'service-pack',
        label: {
          en_US: 'Nhóm khách hàng',
          zh_CN: '基本',
        },
        path: '/customer-management/customer-group',
      },
      {
        code: 'recommendations',
        label: {
          en_US: 'Danh sách khách hàng',
          zh_CN: '基本',
        },
        path: '/customer-management/list-customer',
      },
      {
        code: 'recommendations',
        label: {
          en_US: 'Danh sách yêu cầu',
          zh_CN: '基本',
        },
        path: '/customer-management/list-request',
      },
    ],
  },
  {
    code: 'Khuyennghi',
    icon: 'documentation',
    label: {
      en_US: 'Quản lý khuyến nghị',
      zh_CN: '文档',
    },
    path: '/documentation',
    children: [
      {
        code: 'service-pack',
        label: {
          en_US: 'Duyệt khuyến nghị',
          zh_CN: '基本',
        },
        path: '/signal/create-and-approve',
      },
      {
        code: 'recommendations',
        label: {
          en_US: 'Danh sách khuyến nghị',
          zh_CN: '基本',
        },
        path: '/product-managament/recommendations',
      },
    ],
  },
];
