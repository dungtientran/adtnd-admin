import type { ColumnTyle } from './index.interface';

import { Col, Row, Space, Typography } from 'antd';
import moment from 'moment';

const { Title, Text } = Typography;

interface IDetailsContract {
  details: ColumnTyle;
}

const DetailsContract: React.FC<IDetailsContract> = ({ details }) => {
  return (
    <div>
      <Title level={5} style={{ textAlign: 'center', margin: '0' }}>
        Hợp đồng số{' '}
        <Title level={2} style={{ color: 'red' }}>
          {details?.contract_no}
        </Title>
      </Title>
      <Row>
        <Col span={12}>
          <Title level={4}>Khách hàng</Title>
          <Space direction="vertical">
            <Space>
              <Text>Tên: </Text>
              <Text strong>{details?.name}</Text>
            </Space>
            <Space>
              <Text>Mã: </Text>
              <Text strong>{details?.customer_code}</Text>
            </Space>
            <Space>
              <Text>Số điện thoại: </Text>
              <Text strong>{details?.phone_number}</Text>
            </Space>
            <Space>
              <Text>Email: </Text>
              <Text strong>{details?.email}</Text>
            </Space>
          </Space>
          <Title level={4}>Nhân viên quản lý</Title>
          <Space direction="vertical">
            <Space>
              <Text>Tên: </Text>
              <Text strong>{details?.name_sale}</Text>
            </Space>
            <Space>
              <Text>Mã: </Text>
              <Text strong>{details?.staff_code}</Text>
            </Space>
          </Space>
        </Col>
        <Col span={12}>
          <Title level={4}>Thông tin hợp đồng</Title>

          <Space direction="vertical">
            <Space>
              <Text>Giá trị ban đầu: </Text>
              <Text strong>{details?.initial_value}</Text>
            </Space>
            <Space>
              <Text>Lợi nhuận dự kiến (%): </Text>
              <Text strong>{details?.initial_value}</Text>
            </Space>
            <Space>
              <Text>Hoa hồng tạm tính (%): </Text>
              <Text strong>{details?.commission}</Text>
            </Space>
            <Space>
              <Text>Ngày bắt đầu: </Text>
              <Text strong>{moment(details?.start_date).format('DD/MM/YYYY')}</Text>
            </Space>
            <Space>
              <Text>Ngày kết thúc: </Text>
              <Text strong>{moment(details?.end_date).format('DD/MM/YYYY')}</Text>
            </Space>
            <Space>
              <Text>Tình trạng hợp đồng: </Text>
              <Text strong> {details?.status === 'active' ? 'Đang có hiệu lực' : 'Đã thanh  lý'}</Text>
            </Space>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default DetailsContract;
