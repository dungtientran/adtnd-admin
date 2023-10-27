import type { MenuList } from '@/interface/layout/menu.interface';

export const menuListHandle: MenuList = [
  {
    code: 'dashboard',
    icon: 'dashboard',
    label: { zh_CN: '首页', en_US: 'Dashboard' },
    path: '/dashboard',
  },
  {
    code: 'product-managament',
    icon: 'product',
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
    code: 'signal',
    icon: 'notification',
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
        path: '/signal/recommendations',
      },
    ],
  },
  {
    code: 'customer-management',
    icon: 'client',
    label: {
      en_US: 'Quản lý khách hàng',
      zh_CN: '文档',
    },
    path: '/documentation',
    children: [
      {
        code: 'recommendations',
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
    code: 'contract',
    icon: 'rate',
    label: {
      en_US: 'Quản lý hợp đồng Vip',
      zh_CN: '文档',
    },
    path: '/documentation',
    children: [
      {
        code: 'recommendations',
        label: {
          en_US: 'Hợp đồng có hiệu lực',
          zh_CN: '基本',
        },
        path: '/contract/active',
      },
      {
        code: 'recommendations',
        label: {
          en_US: 'Hợp đồng đã thanh lý',
          zh_CN: '基本',
        },
        path: '/contract/block',
      },
    ],
  },
  {
    code: 'interest-rate',
    icon: 'rate',
    label: {
      en_US: 'Quản lý hoa hồng',
      zh_CN: '文档',
    },
    path: '/documentation',
    children: [
      {
        code: 'service-pack',
        label: {
          en_US: 'Thiết lập hoa hồng',
          zh_CN: '基本',
        },
        path: '/interest-rate/set-interest-rate',
      },
    ],
  },
  {
    code: 'transaction',
    icon: 'finance',
    label: {
      en_US: 'Quản lý tài chính',
      zh_CN: '文档',
    },
    path: '/documentation',
    children: [
      {
        code: 'transaction-history',
        label: {
          en_US: 'Lịch sử giao dịch',
          zh_CN: '基本',
        },
        path: '/transaction/transaction-history',
      },
      {
        code: 'invoice',
        label: {
          en_US: 'Chứng từ thanh toán',
          zh_CN: '基本',
        },
        path: '/transaction/invoice/list',
      },
    ],
  },
  {
    code: 'user-management',
    icon: 'account',
    label: {
      en_US: 'Quản trị người dùng',
      zh_CN: '文档',
    },
    path: '/documentation',
    children: [
      {
        code: 'list',
        label: {
          en_US: 'Danh sách quản trị viên',
          zh_CN: '基本',
        },
        path: '/user-management/list',
      },
    ],
  },
  {
    code: 'application',
    icon: 'setting',
    label: {
      en_US: 'Thiết lập ứng dụng',
      zh_CN: '文档',
    },
    path: '',
    children: [
      {
        code: 'greeting',
        label: {
          en_US: 'Thiết lập câu chào',
          zh_CN: '基本',
        },
        path: '/application/greeting',
      },
      {
        code: 'support',
        label: {
          en_US: 'Thiết lập liên kết hỗ trợ',
          zh_CN: '基本',
        },
        path: '/application/support',
      },
    ],
  },
 
];
