import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';

import HeadTitle from '@/pages/components/head-title/HeadTitle';

const { Title, Text } = Typography;

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Col, InputNumber, message, Row, Space, Typography } from 'antd';

import { listGreetingApi } from '@/api/ttd_greeting';

import BoxGreeting from './Box';

const { getListGreeting, updateGreeting } = listGreetingApi;

export interface IGreeting {
  id: number | null;
  main_content: string;
  sub_content: string;
  trial_duration: number | null;
}

const Greeting = () => {
  const queryClient = useQueryClient();

  const [greeting, seGreeting] = useState<IGreeting>({
    id: null,
    main_content: '',
    sub_content: '',
    trial_duration: null,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getListGreeting'],
    queryFn: () => getListGreeting(),
  });

  const useUpdateGreeting = () => {
    const mutation = useMutation(updateGreeting, {
      onSuccess: () => {
        queryClient.invalidateQueries(['getListGreeting']);
        message.success('Update thành công');
      },
      onError: _ => {
        message.error('Update thất bại');
      },
    });

    return mutation;
  };

  useEffect(() => {
    if (data?.code === 200) {
      seGreeting(data?.data);
    }
  }, [data]);

  return (
    <div className="aaa">
      <HeadTitle title="Thiết lập câu chào" />
      <div style={{ marginTop: '40px' }}>
        <BoxGreeting
          title="Nội dung câu chào"
          descriptions={greeting.main_content}
          useUpdateGreeting={useUpdateGreeting}
          data={greeting}
          keySelected="main_content"
        />
        <BoxGreeting
          title="Nội dung câu chào phụ"
          descriptions={greeting.sub_content}
          useUpdateGreeting={useUpdateGreeting}
          data={greeting}
          keySelected="sub_content"
        />
        <BoxGreeting
          title="Thiết lập số ngày dùng thử"
          descriptions={greeting.trial_duration}
          useUpdateGreeting={useUpdateGreeting}
          data={greeting}
          keySelected="trial_duration"
        />
      </div>
    </div>
  );
};

export default Greeting;
