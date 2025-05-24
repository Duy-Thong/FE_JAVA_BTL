import React, { useState, useEffect } from 'react';
import OrderManager from '../../components/Admin/Order/OrderManager';
import type { Order } from '../../components/Admin/Order/OrderManager';

const OrderPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  return (
    <OrderManager 
      ordersData={orders} 
      setOrdersData={setOrders} 
    />
  );
};

export default OrderPage;
