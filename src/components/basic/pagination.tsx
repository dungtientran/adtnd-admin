import type { FC } from 'react';

import { Pagination } from 'antd';

const BasePagenation: FC = props => {
  return <Pagination  {...props} />;
};

const MyPagination = Object.assign(Pagination, BasePagenation);

export default MyPagination;
