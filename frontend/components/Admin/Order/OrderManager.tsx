import React, { useState } from 'react';
import { Table, Tag, Space, Button, Modal, Input, message, Tooltip } from 'antd';
import { SearchOutlined, EyeOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';

// Update Shipment interface to match backend model
interface Shipment {
  id: string;
  trackingNumber: string;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  notes: string;
  shippingFee: number;
  status: ShipmentStatus;
  createdAt: string;
  updatedAt: string;
}

// Update ShipmentStatus enum to match backend
type ShipmentStatus = 
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPING'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED';

// Update Order interface to match backend model
interface Order {
  id: string;
  user: {
    id: string;
  };
  totalAmount: number;
  shippingAddress: string;
  phoneNumber: string;
  customerName: string;
  note: string;
  paymentMethod: string;
  cardNumber?: string;
  cardHolder?: string;
  status: string;
  createdAt: string;
  shipmentId: string;
}

interface OrderManagerProps {
  ordersData: Order[];
}

interface OrderItem {
  id: string;
  product: {
    name: string;
    price: number;
    img_url: string; // Changed from imageUrl to img_url to match backend
  };
  quantity: number;
  price: number;
}

interface OrderDetails {
  order: Order;
  shipment: Shipment;
  orderItems: OrderItem[];
}

const OrderManager: React.FC<OrderManagerProps> = ({ ordersData }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrderItems, setSelectedOrderItems] = useState<OrderItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState<string>('');

  const fetchOrderItems = async (orderId: string) => {
    setLoading(true);
    try {
      const order = ordersData.find(o => o.id === orderId);
      setSelectedOrder(order || null);

      // Fetch both order items and shipment details
      const [itemsResponse, shipmentResponse] = await Promise.all([
        fetch(`http://localhost:8080/api/orderItems/order/${orderId}`),
        fetch(`http://localhost:8080/api/shipments/order/${orderId}`)
      ]);

      if (itemsResponse.ok && shipmentResponse.ok) {
        const items = await itemsResponse.json();
        const shipments = await shipmentResponse.json();
        
        // Assuming one shipment per order, take the first one
        const shipment = shipments[0];
        
        setSelectedOrderItems(items);
        setSelectedOrder(prev => prev ? {...prev, shipmentId: shipment.id} : null);
        setIsModalVisible(true);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      message.error('Lỗi khi tải thông tin đơn hàng');
    }
    setLoading(false);
  };

  const getColumnSearchProps = (dataIndex: keyof Order) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Tìm kiếm`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
          >
            Tìm
          </Button>
          <Button onClick={() => clearFilters()} size="small">
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value: string, record: Order) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()) ?? false,
  });

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Chờ xử lý';
      case 'APPROVED': return 'Đã duyệt';
      case 'COMPLETED': return 'Hoàn thành';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return { color: '#d97706', bg: '#fef3c7' };
      case 'APPROVED': return { color: '#2563eb', bg: '#dbeafe' };
      case 'COMPLETED': return { color: '#059669', bg: '#d1fae5' };
      case 'CANCELLED': return { color: '#dc2626', bg: '#fee2e2' };
      default: return { color: '#6b7280', bg: '#f3f4f6' };
    }
  };

  const updateShipmentStatus = async (id: string, status: ShipmentStatus): Promise<Shipment> => {
    const response = await fetch(`http://localhost:8080/api/shipments/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(status)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Lỗi khi cập nhật trạng thái vận chuyển');
    }

    return response.json();
  };

  const handleStatusUpdate = async (orderId: string, orderStatus: string) => {
    setStatusLoading(orderId);
    try {
      // First, get the shipment for this order
      const shipmentResponse = await fetch(`http://localhost:8080/api/shipments/order/${orderId}`);
      if (!shipmentResponse.ok) {
        throw new Error('Không tìm thấy thông tin vận chuyển');
      }
      const shipments = await shipmentResponse.json();
      const shipment = shipments[0]; // Assuming one shipment per order

      if (!shipment) {
        throw new Error('Không tìm thấy thông tin vận chuyển');
      }

      // Update order status
      const orderResponse = await fetch(`http://localhost:8080/api/orders/${orderId}/status?status=${orderStatus}`, {
        method: 'PUT',
      });

      if (!orderResponse.ok) {
        throw new Error('Lỗi khi cập nhật trạng thái đơn hàng');
      }

      // Map order status to shipment status
      let shipmentStatus: ShipmentStatus;
      switch (orderStatus) {
        case 'APPROVED':
          shipmentStatus = 'CONFIRMED';
          break;
        case 'CANCELLED':
          shipmentStatus = 'CANCELLED';
          break;
        case 'COMPLETED':
          shipmentStatus = 'DELIVERED';
          break;
        default:
          shipmentStatus = 'PENDING';
      }

      await updateShipmentStatus(shipment.id, shipmentStatus);
      message.success('Cập nhật trạng thái thành công');
      window.location.reload();
    } catch (error) {
      console.error('Error updating status:', error);
      message.error(error instanceof Error ? error.message : 'Lỗi khi cập nhật trạng thái');
    } finally {
      setStatusLoading('');
    }
  };

  const styles = {
    container: {
      padding: '24px',
      background: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    },
    table: {
      '.ant-table': {
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      },
      '.ant-table-thead > tr > th': {
        backgroundColor: '#f8fafc',
        color: '#1f2937',
        fontWeight: 600,
        fontSize: '14px',
        padding: '16px 12px',
      },
      '.ant-table-tbody > tr > td': {
        padding: '16px 12px',
        fontSize: '14px',
      },
      '.ant-table-tbody > tr:hover > td': {
        backgroundColor: '#f8fafc',
      },
    },
    actionButton: {
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 12px',
      transition: 'all 0.3s ease',
    },
    modalContent: {
      orderInfo: {
        marginBottom: '28px',
        borderBottom: '1px solid #e5e7eb',
        padding: '20px 0',
      },
      grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        marginBottom: '20px',
      },
      note: {
        padding: '16px',
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        marginTop: '12px',
        border: '1px solid #e5e7eb',
      },
      section: {
        marginBottom: '32px',
        '& h4': {
          fontSize: '16px',
          fontWeight: 600,
          color: '#1f2937',
          marginBottom: '16px',
        },
      },
      label: {
        color: '#6b7280',
        fontWeight: 500,
        marginBottom: '4px',
      },
      value: {
        color: '#1f2937',
        fontSize: '14px',
      },
    },
  };

  const ActionButtons: React.FC<{ record: Order }> = ({ record }) => (
    <Space size="small" className="flex">
      <Tooltip title="Xem chi tiết">
        <Button
          type="primary"
          icon={<EyeOutlined />}
          className="flex items-center justify-center bg-blue-500 hover:bg-blue-600"
          onClick={() => fetchOrderItems(record.id)}
        />
      </Tooltip>
      {record.status === 'PENDING' && (
        <Tooltip title="Duyệt đơn">
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            loading={statusLoading === record.id}
            className="flex items-center justify-center bg-green-500 hover:bg-green-600"
            onClick={() => handleStatusUpdate(record.id, 'APPROVED')}
          />
        </Tooltip>
      )}
      {record.status === 'APPROVED' && (
        <Tooltip title="Hoàn thành">
          <Button 
            type="primary"
            style={{ backgroundColor: '#52c41a' }}
            icon={<CheckCircleOutlined />}
            loading={statusLoading === record.id}
            onClick={() => handleStatusUpdate(record.id, 'COMPLETED')}
          />
        </Tooltip>
      )}
      {(record.status === 'PENDING' || record.status === 'APPROVED') && (
        <Tooltip title="Hủy đơn">
          <Button 
            danger
            type="primary"
            icon={<CloseCircleOutlined />}
            loading={statusLoading === record.id}
            onClick={() => handleStatusUpdate(record.id, 'CANCELLED')}
          />
        </Tooltip>
      )}
    </Space>
  );

  const OrderDetailsModal: React.FC = () => (
    <Modal
      title={
        <div className="flex items-center gap-3 border-b pb-3">
          <h3 className="text-xl font-semibold text-gray-800 m-0">
            Chi tiết đơn hàng
          </h3>
          {selectedOrder && (
            <Tag className="m-0" color={getStatusColor(selectedOrder.status).color}>
              {getStatusLabel(selectedOrder.status)}
            </Tag>
          )}
        </div>
      }
      open={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      footer={null}
      width={900}
      className="top-5"
    >
      {selectedOrder && (
        <div className="p-4">
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <span className="text-gray-500">Mã đơn hàng</span>
                  <p className="font-medium">{selectedOrder.id}</p>
                </div>
                <div>
                  <span className="text-gray-500">Khách hàng</span>
                  <p className="font-medium">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <span className="text-gray-500">Số điện thoại</span>
                  <p className="font-medium">{selectedOrder.phoneNumber}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-500">Ngày tạo</span>
                  <p className="font-medium">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Phương thức thanh toán</span>
                  <p className="font-medium">{selectedOrder.paymentMethod}</p>
                </div>
                <div>
                  <span className="text-gray-500">Tổng tiền</span>
                  <p className="font-medium text-green-600">
                    {selectedOrder.totalAmount.toLocaleString('vi-VN')}đ
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-gray-500">Địa chỉ giao hàng</span>
              <p className="font-medium">{selectedOrder.shippingAddress}</p>
            </div>
            {selectedOrder.note && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <span className="text-gray-500">Ghi chú</span>
                <p className="font-medium text-gray-700">{selectedOrder.note}</p>
              </div>
            )}
          </div>

          <div className="rounded-lg border border-gray-200">
            <Table
              columns={orderItemColumns}
              dataSource={selectedOrderItems}
              rowKey="id"
              loading={loading}
              pagination={false}
              className="rounded-lg overflow-hidden"
              summary={() => (
                <Table.Summary fixed>
                  <Table.Summary.Row className="bg-gray-50">
                    <Table.Summary.Cell index={0} colSpan={4}>
                      <strong>Tổng tiền:</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <strong className="text-green-600">
                        {calculateTotal(selectedOrderItems).toLocaleString('vi-VN')}đ
                      </strong>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
          </div>
        </div>
      )}
    </Modal>
  );

  const columns: ColumnsType<Order> = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      ...getColumnSearchProps('id'),
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      width: 150,
      ...getColumnSearchProps('customerName'),
      sorter: (a, b) => a.customerName.localeCompare(b.customerName),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 120,
      ...getColumnSearchProps('phoneNumber'),
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'shippingAddress',
      key: 'shippingAddress',
      width: 200,
      render: (address: string) => (
        <span style={{ maxWidth: 200, display: 'block', whiteSpace: 'normal' }}>
          {address}
        </span>
      ),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      width: 150,
      render: (note: string) => (
        <span style={{ maxWidth: 150, display: 'block', whiteSpace: 'normal' }}>
          {note || '-'}
        </span>
      ),
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 150,
      filters: [
        { text: 'Tiền mặt', value: 'CASH' },
        { text: 'Thẻ', value: 'CARD' },
      ],
      onFilter: (value: string, record) => record.paymentMethod === value,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: string) => new Date(date).toLocaleString(),
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      defaultSortOrder: 'descend'
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      render: (amount: number) => `${amount.toLocaleString('vi-VN')}đ`,
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      filters: [
        { text: 'Chờ xử lý', value: 'PENDING' },
        { text: 'Đã duyệt', value: 'APPROVED' },
        { text: 'Hoàn thành', value: 'COMPLETED' },
        { text: 'Đã hủy', value: 'CANCELLED' },
      ],
      onFilter: (value: string, record) => record.status === value,
      render: (status: string) => {
        const { color, bg } = getStatusColor(status);
        return (
          <Tag 
            className={`px-3 py-1 rounded-full text-sm font-medium border-none`}
            style={{ 
              color: color,
              backgroundColor: bg,
            }}
          >
            {getStatusLabel(status)}
          </Tag>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (_, record: Order) => <ActionButtons record={record} />,
    },
  ];

  const orderItemColumns = [
    {
      title: 'Hình ảnh',
      dataIndex: ['product', 'img_url'], // Changed from imageUrl to img_url
      key: 'image',
      width: 80,
      render: (img_url: string) => (
        <img 
          src={img_url} 
          alt="Sản phẩm" 
          style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
        />
      ),
    },
    {
      title: 'Sản phẩm',
      dataIndex: ['product', 'name'],
      key: 'productName',
      width: 300,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price: number) => `${price.toLocaleString('vi-VN')}đ`,
    },
    {
      title: 'Thành tiền',
      key: 'total',
      width: 120,
      render: (record: OrderItem) => `${(record.price * record.quantity).toLocaleString('vi-VN')}đ`,
    },
  ];

  const calculateTotal = (items: OrderItem[]) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const renderOrderStatus = (status: string) => (
    <p>
      <strong>Trạng thái:</strong> 
      <Tag color={getStatusColor(status)} style={{ marginLeft: 8 }}>
        {getStatusLabel(status)}
      </Tag>
    </p>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <Table 
        columns={columns} 
        dataSource={ordersData} 
        rowKey="id"
        scroll={{ x: 1200 }}
        className="rounded-lg overflow-hidden"
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) => (
            <span className="text-gray-600">
              Hiển thị {range[0]}-{range[1]} của {total} đơn hàng
            </span>
          ),
          className: "mt-4"
        }}
      />
      <OrderDetailsModal />
    </div>
  );
};

export default OrderManager;
