import React from 'react'
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;

const LoadingPage = () => {
  return (
    <div className='flex items-center h-screen justify-center bg-white'>
      <Spin indicator={antIcon} />
    </div>
  )
}

export default LoadingPage