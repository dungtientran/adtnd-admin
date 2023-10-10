import { Typography } from 'antd';

const { Title } = Typography;

interface IHeadTitle {
  title: string;
}

const HeadTitle: React.FC<IHeadTitle> = ({ title }) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <Title level={2}>{title}</Title>
    </div>
  );
};

export default HeadTitle;
