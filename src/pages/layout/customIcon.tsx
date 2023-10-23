import type { FC } from 'react';

import { ReactComponent as AccountSvg } from '@/assets/menu/account.svg';
import { ReactComponent as ClientSvg } from '@/assets/menu/client.svg';
import { ReactComponent as DashboardSvg } from '@/assets/menu/dashboard.svg';
import { ReactComponent as DocumentationSvg } from '@/assets/menu/documentation.svg';
import { ReactComponent as FinanceSvg } from '@/assets/menu/finance.svg';
import { ReactComponent as GuideSvg } from '@/assets/menu/guide.svg';
import { ReactComponent as NotificationSvg } from '@/assets/menu/notification.svg';
import { ReactComponent as PermissionSvg } from '@/assets/menu/permission.svg';
import { ReactComponent as ProductSvg } from '@/assets/menu/product.svg';
import { ReactComponent as RateSvg } from '@/assets/menu/rate.svg';
import { ReactComponent as SettingSvg } from '@/assets/menu/setting.svg';

interface CustomIconProps {
  type: string;
}

export const CustomIcon: FC<CustomIconProps> = props => {
  const { type } = props;
  let com = <GuideSvg />;

  if (type === 'guide') {
    com = <GuideSvg />;
  } else if (type === 'permission') {
    com = <PermissionSvg />;
  } else if (type === 'dashboard') {
    com = <DashboardSvg />;
  } else if (type === 'account') {
    com = <AccountSvg />;
  } else if (type === 'documentation') {
    com = <DocumentationSvg />;
  } else if (type === 'product') {
    com = <ProductSvg />;
  } else if (type === 'notification') {
    com = <NotificationSvg />;
  } else if (type === 'client') {
    com = <ClientSvg />;
  } else if (type === 'rate') {
    com = <RateSvg />;
  } else if (type === 'finance') {
    com = <FinanceSvg />;
  } else if (type === 'setting') {
    com = <SettingSvg />;
  }  else {
    com = <GuideSvg />;
  }

  return <span className="anticon">{com}</span>;
};
