"use client"
import React, { useState, useEffect } from 'react'
import { Layout } from 'antd';
const { Content } = Layout;

import LoadingPage from '../../components/home/LoadingPage';
import ShipmentManager from '../../components/Admin/Shipment/ShipmentManager';
import { Shipment, ShipmentStatus } from '../../types/shipment';

const ShipperPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [shipmentsData, setShipmentsData] = useState<Shipment[]>([]);
  const [shipmentsError, setShipmentsError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/shipments/all')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data: Shipment[]) => {
        setShipmentsData(data);
        setShipmentsError(null);
      })
      .catch(error => {
        console.error('Shipments fetch error:', error);
        setShipmentsError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleShipmentDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/shipments/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete shipment');
      setShipmentsData(shipmentsData.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting shipment:', error);
    }
  };

  const handleShipmentUpdate = async (id: string, shipment: Partial<Shipment>) => {
    try {
      const response = await fetch(`http://localhost:8080/api/shipments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shipment),
      });
      if (!response.ok) throw new Error('Failed to update shipment');
      const updatedShipment = await response.json();
      setShipmentsData(shipmentsData.map(s => s.id === id ? updatedShipment : s));
    } catch (error) {
      console.error('Error updating shipment:', error);
    }
  };

  const handleShipmentStatusUpdate = async (id: string, status: ShipmentStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/api/shipments/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update shipment status');
      const updatedShipment = await response.json();
      setShipmentsData(shipmentsData.map(s => s.id === id ? updatedShipment : s));
    } catch (error) {
      console.error('Error updating shipment status:', error);
    }
  };

  return (isLoading ? (
    <LoadingPage />
  ) : (
    <Layout className='flex min-h-screen overflow-auto animate__animated animate__fade'>
      <Layout className='p-4'>
        <Content className='w-full min-h-screen p-4 bg-white rounded-xl'>
          <div className='flex justify-between mt-4 mb-8'>
            <h1 className='text-3xl font-bold text-black'>Quản lý vận chuyển</h1>
          </div>
          {shipmentsError ? (
            <div className="text-red-500">Error loading shipments: {shipmentsError}</div>
          ) : (
            <ShipmentManager 
              shipmentsData={shipmentsData}
              onDelete={handleShipmentDelete}
              onUpdate={handleShipmentUpdate}
              onStatusUpdate={handleShipmentStatusUpdate}
            />
          )}
        </Content>
      </Layout>
    </Layout>
  ));
}

export default ShipperPage
