import type { MenuList } from '@/interface/layout/menu.interface';

export const menuListHandle: MenuList = [
  {
    code: 'dashboard',
    icon: 'dashboard',
    label: { zh_CN: '首页', en_US: 'Dashboard' },
    path: '/dashboard',
  },
  {
    code: 'dashboard',
    icon: 'documentation',
    label: {
      en_US: 'Quản lý sản phầm',
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
      {
        code: 'recommendations',
        label: {
          en_US: 'Khuyến nghị',
          zh_CN: '基本',
        },
        path: '/product-managament/recommendations',
      },
    ],
  },
];
