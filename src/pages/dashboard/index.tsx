import type { FC } from 'react';

import './index.less';

import { Typography } from 'antd';
import { useEffect, useState } from 'react';

const DashBoardPage: FC = () => {
  const [loading, setLoading] = useState(true);

  // mock timer to mimic dashboard data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(undefined as any);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div>
      {/* <iframe
        title="Report Section"
        width="100%"
        height="100%"
        src="https://app.powerbi.com/view?r=eyJrIjoiNGUwNDRlNzgtMzU1Yy00ODE5LTllYjktM2I3NDMyNjBjOWZlIiwidCI6ImVhOWYwMzc2LTI3ZjUtNGFmYy1hYmFmLWEyOWM5YjVhYzhhNCIsImMiOjEwfQ%3D%3D"
        frameBorder="0"
        allowFullScreen={true}
      /> */}
      <iframe
        title="Report Section"
        width="100%"
        height="100%"
        src="https://app.powerbi.com/view?r=eyJrIjoiZTczYWU2ZjItMzcyYS00MTc2LWJjMGYtNGU5YTFiMGZmMmYzIiwidCI6ImVhOWYwMzc2LTI3ZjUtNGFmYy1hYmFmLWEyOWM5YjVhYzhhNCIsImMiOjEwfQ%3D%3D"
        frameBorder="0"
        allowFullScreen={true}
      ></iframe>
    </div>
  );
};

export default DashBoardPage;
