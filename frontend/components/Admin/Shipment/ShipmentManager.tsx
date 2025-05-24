import React, { useState } from 'react';
import { Table, Select, message, Modal, Tag, Space, Button, Spin } from 'antd';
import dayjs from 'dayjs';
import { ExclamationCircleOutlined, EyeOutlined } from '@ant-design/icons';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  productImage?: string;
  sku?: string;
}

interface Shipment {
  id: string;
  trackingNumber: string;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  shippingFee: number;
  status: ShipmentStatus;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  orderItems: OrderItem[];
  totalAmount: number;
}

enum ShipmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED'
}

interface ShipmentManagerProps {
  shipmentsData: Shipment[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, shipment: Shipment) => void;
  onStatusUpdate: (id: string, status: ShipmentStatus) => Promise<void>;
}

// Add this type for API error handling
interface ApiError {
  message: string;
  status: number;
}

interface ShipmentItemsResponse {
  orderItems: OrderItem[];
  totalAmount: number;
}

interface OrderItemResponse {
  id: string;
  product: {
    id: string;
    name: string;
    img_url: string;
  };
  quantity: number;
  price: number;
}

const ShipmentManager: React.FC<ShipmentManagerProps> = ({ 
  shipmentsData: initialShipments,  // rename prop to indicate it's initial data
  onDelete, 
  onUpdate, 
  onStatusUpdate 
}) => {
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [shipments, setShipments] = useState<Shipment[]>(initialShipments);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [loadingOrderItems, setLoadingOrderItems] = useState(false);

  const statusLabels: Record<ShipmentStatus, string> = {
    [ShipmentStatus.PENDING]: 'Chờ xử lý',
    [ShipmentStatus.CONFIRMED]: 'Đã xác nhận',
    [ShipmentStatus.PROCESSING]: 'Đang xử lý',
    [ShipmentStatus.SHIPPING]: 'Đang giao hàng',
    [ShipmentStatus.DELIVERED]: 'Đã giao hàng',
    [ShipmentStatus.CANCELLED]: 'Đã hủy',
    [ShipmentStatus.RETURNED]: 'Đã hoàn trả'
  };

  const showDeleteConfirm = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      icon: <ExclamationCircleOutlined className="text-red-500" />,
      content: 'Bạn có chắc chắn muốn xóa đơn vận chuyển này?',
      okText: 'Xóa',
      okButtonProps: { className: 'bg-red-500 hover:bg-red-600' },
      cancelText: 'Hủy',
      onOk() {
        onDelete(id);
      },
    });
  };

  const updateShipmentStatus = async (id: string, status: ShipmentStatus): Promise<Shipment> => {
    const response = await fetch(`/api/shipments/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(status)
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || 'Lỗi khi cập nhật trạng thái');
    }

    return response.json();
  };

  const handleStatusChange = async (id: string, newStatus: ShipmentStatus) => {
    try {
      setUpdatingStatus(id);
      const updatedShipment = await updateShipmentStatus(id, newStatus);
      
      // Cập nhật state local
      setShipments(prevShipments => 
        prevShipments.map(shipment => 
          shipment.id === id ? updatedShipment : shipment
        )
      );
      
      await onStatusUpdate(id, newStatus);
      message.success('Cập nhật trạng thái thành công');
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Không thể cập nhật trạng thái');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status: ShipmentStatus): string => {
    const colors: Record<ShipmentStatus, string> = {
      [ShipmentStatus.PENDING]: 'blue',
      [ShipmentStatus.CONFIRMED]: 'cyan',
      [ShipmentStatus.PROCESSING]: 'orange',
      [ShipmentStatus.SHIPPING]: 'geekblue',
      [ShipmentStatus.DELIVERED]: 'green',
      [ShipmentStatus.CANCELLED]: 'red',
      [ShipmentStatus.RETURNED]: 'purple',
    };
    return colors[status];
  };

  const showShipmentDetail = async (shipment: Shipment) => {
    try {
      setSelectedShipment(shipment);
      setIsDetailModalVisible(true);
      setLoadingOrderItems(true);

      // Get orderId as plain text
      const orderIdResponse = await fetch(`/api/shipments/${shipment.id}/order-id`);
      if (!orderIdResponse.ok) throw new Error('Failed to fetch order ID');
      const orderId = await orderIdResponse.text(); // Change from .json() to .text()

      // Then fetch order items using order ID
      const orderItemsResponse = await fetch(`/api/orderItems/order/${orderId}`);
      if (!orderItemsResponse.ok) throw new Error('Failed to fetch order items');
      const orderItems: OrderItemResponse[] = await orderItemsResponse.json();

      // Rest of the function remains the same...
      const transformedItems: OrderItem[] = orderItems.map(item => ({
        id: item.id,
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.img_url,
        quantity: item.quantity,
        price: item.price,
        sku: '-'
      }));

      const totalAmount = transformedItems.reduce(
        (sum, item) => sum + (item.price * item.quantity), 
        0
      );

      setSelectedShipment(prev => prev ? {
        ...prev,
        orderItems: transformedItems,
        totalAmount: totalAmount
      } : null);

    } catch (error) {
      message.error('Không thể tải thông tin chi tiết đơn hàng');
      console.error('Error:', error);
    } finally {
      setLoadingOrderItems(false);
    }
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
      width: 180,
      render: (text: string) => (
        <span className="font-semibold text-blue-600">{text}</span>
      ),
    },
    {
      title: 'Mã vận đơn',
      dataIndex: 'trackingNumber',
      key: 'trackingNumber',
      width: 150,
      render: (text: string) => (
        <span className="font-medium text-blue-600">{text}</span>
      ),
    },
    {
      title: 'Người nhận',
      key: 'recipient',
      width: 180,
      render: (record: Shipment) => (
        <div className="space-y-1">
          <div className="font-medium">{record.recipientName}</div>
          <div className="text-gray-500 text-sm">{record.recipientPhone}</div>
        </div>
      ),
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'shippingAddress',
      key: 'shippingAddress',
      width: 250,
      render: (text: string) => (
        <div className="text-sm text-gray-600">{text}</div>
      ),
    },
    {
      title: 'Phí vận chuyển',
      dataIndex: 'shippingFee',
      key: 'shippingFee',
      width: 120,
      render: (fee: number) => (
        <span className="font-medium text-green-600">
          {fee.toLocaleString('vi-VN')}đ
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 160,
      render: (status: ShipmentStatus, record: Shipment) => (
        <Select
          value={status}
          onChange={(value) => handleStatusChange(record.id, value as ShipmentStatus)}
          className="w-full"
          disabled={updatingStatus === record.id}
          loading={updatingStatus === record.id}
          size="middle"
        >
          {Object.entries(statusLabels).map(([value, label]) => (
            <Select.Option key={value} value={value}>
              <Tag color={getStatusColor(value as ShipmentStatus)}>
                {label}
              </Tag>
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Cập nhật lần cuối',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 150,
      render: (date: string) => date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '-',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      key: 'notes',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      render: (_, record: Shipment) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => showShipmentDetail(record)}
        >
          Xem chi tiết
        </Button>
      ),
    }
  ];

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Quản lý vận chuyển
        </h2>
        
        <div className="bg-white rounded-lg shadow-md">
          <Table 
            columns={columns} 
            dataSource={shipments} // Sử dụng state thay vì prop
            rowKey="id"
            pagination={{ 
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng số ${total} đơn vận chuyển`,
              className: "p-4"
            }}
            scroll={{ x: 1500 }}
            className="border border-gray-200"
            rowClassName="hover:bg-gray-50"
          />
        </div>
      </div>

      <Modal
        title={
          <div className="text-lg font-bold text-gray-800 border-b pb-3">
            Chi tiết đơn vận chuyển
          </div>
        }
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
        width={900}
        className="max-h-[90vh] overflow-auto"
      >
        {selectedShipment && (
          <div className="space-y-6 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-700 mb-3">
                  Thông tin vận đơn
                </h3>
                <p>Mã vận đơn: {selectedShipment.trackingNumber}</p>
                <p>Trạng thái: 
                  <Tag color={getStatusColor(selectedShipment.status)} className="ml-2">
                    {selectedShipment.status}
                  </Tag>
                </p>
                <p>Phí vận chuyển: {selectedShipment.shippingFee.toLocaleString('vi-VN')}đ</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-700 mb-3">
                  Thông tin người nhận
                </h3>
                <p>Tên: {selectedShipment.recipientName}</p>
                <p>Số điện thoại: {selectedShipment.recipientPhone}</p>
                <p>Địa chỉ: {selectedShipment.shippingAddress}</p>
              </div>
            </div>

            {/* Products section */}
            <div className="bg-white rounded-lg shadow-sm">
              <h3 className="font-bold text-gray-700 p-4 border-b">
                Danh sách sản phẩm
              </h3>
              <div className="overflow-x-auto">
                {loadingOrderItems ? (
                  <div className="text-center py-4">
                    <Spin tip="Đang tải danh sách sản phẩm..." />
                  </div>
                ) : selectedShipment?.orderItems && selectedShipment.orderItems.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Sản phẩm</th>
                        <th className="px-4 py-2 text-center">Mã SKU</th>
                        <th className="px-4 py-2 text-center">Số lượng</th>
                        <th className="px-4 py-2 text-right">Đơn giá</th>
                        <th className="px-4 py-2 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedShipment.orderItems.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              {item.productImage && (
                                <img 
                                  src={item.productImage} 
                                  alt={item.productName}
                                  className="w-12 h-12 object-cover rounded mr-3"
                                />
                              )}
                              <span>{item.productName}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">{item.sku || '-'}</td>
                          <td className="px-4 py-3 text-center">{item.quantity}</td>
                          <td className="px-4 py-3 text-right">
                            {item.price.toLocaleString('vi-VN')}đ
                          </td>
                          <td className="px-4 py-3 text-right">
                            {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={4} className="px-4 py-3 text-right font-medium">
                          Tổng giá trị đơn hàng:
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-red-600">
                          {(selectedShipment.totalAmount || 0).toLocaleString('vi-VN')}đ
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Không có sản phẩm nào
                  </div>
                )}
              </div>
            </div>

            {/* Notes and timestamps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-700 mb-3">Ghi chú</h3>
                <p className="text-gray-600">
                  {selectedShipment.notes || 'Không có ghi chú'}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-700 mb-3">Thời gian</h3>
                <p>Ngày tạo: {dayjs(selectedShipment.createdAt).format('DD/MM/YYYY HH:mm')}</p>
                <p>Cập nhật lần cuối: {selectedShipment.updatedAt ? dayjs(selectedShipment.updatedAt).format('DD/MM/YYYY HH:mm') : '-'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ShipmentManager;
