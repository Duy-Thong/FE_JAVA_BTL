"use client"
import React, { useState, useEffect } from 'react'
import { Layout } from 'antd';
const { Content } = Layout;

import LoadingPage from '../../components/home/LoadingPage';
import OrderManager from '../../components/Admin/Order/OrderManager';

const SalerPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [ordersData, setOrdersData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/orders/all')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        setOrdersData(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Fetch error:', error);
        setIsLoading(false);
      });
  }, []);

  const handleOrderStatusUpdate = async (id: string, status: string) => {
    try {
      const encodedStatus = encodeURIComponent(status);
      const response = await fetch(`http://localhost:8080/api/orders/${id}/status?status=${encodedStatus}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const updatedOrder = await response.json();
      setOrdersData(ordersData.map((order: any) => 
        order.id === id ? updatedOrder : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleOrderDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/orders/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      setOrdersData(ordersData.filter((order: any) => order.id !== id));
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  return (isLoading ? (
    <LoadingPage />
  ) : (
    <Layout className='flex min-h-screen overflow-auto animate__animated animate__fade'>
      <Layout className='p-4'>
        <Content className='w-full min-h-screen p-4 bg-white rounded-xl'>
          <div className='flex justify-between mt-4 mb-8'>
            <h1 className='text-3xl font-bold text-black'>Quản lý đơn hàng</h1>
          </div>
          <OrderManager 
            ordersData={ordersData}
            onStatusUpdate={handleOrderStatusUpdate}
            onOrderDelete={handleOrderDelete}
          />
        </Content>
      </Layout>
    </Layout>
  ));
}

export default SalerPage
