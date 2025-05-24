import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, DatePicker, Select, Space } from 'antd';
import { UserOutlined, ShoppingOutlined, DollarOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface OrderItem {
  product: {
    id: string;
    name: string;
    price: number;
    img_url: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  user: {
    id: string;
  };
  totalAmount: number;
  customerName: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  orderItems: OrderItem[];
}

interface PopularProduct {
  id: string;
  name: string;
  img_url: string;
  salesCount: number;
  revenue: number;
}

interface StatisticsProps {
  statisticsData: {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    popularProducts: any[];
  };
}

const StatisticsManager: React.FC<StatisticsProps> = ({ statisticsData }) => {
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [popularProducts, setPopularProducts] = useState<PopularProduct[]>([]);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [quarter, setQuarter] = useState<string>('all');
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<any[]>([]);
  const [productShareData, setProductShareData] = useState<any[]>([]);

  const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];
  const CHART_COLORS = {
    primary: '#6366f1',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
  };

  const cardStyle = {
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    transition: 'all 0.3s ease',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    }
  };

  const statisticCardStyle = {
    ...cardStyle,
    background: 'linear-gradient(135deg, #fff 0%, #f3f4f6 100%)',
  };

  const filterOrdersByDate = (orders: Order[], startDate: Date | null, endDate: Date | null) => {
    if (!startDate || !endDate) return orders;
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && orderDate <= endDate;
    });
  };

  const filterOrdersByQuarter = (orders: Order[], selectedQuarter: string) => {
    if (selectedQuarter === 'all') return orders;
    
    const currentYear = new Date().getFullYear();
    const quarters = {
      'Q1': [0, 1, 2],
      'Q2': [3, 4, 5],
      'Q3': [6, 7, 8],
      'Q4': [9, 10, 11]
    };
    
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return quarters[selectedQuarter as keyof typeof quarters].includes(orderDate.getMonth());
    });
  };

  const prepareChartData = (orders: Order[]) => {
    const revenueByDate = orders.reduce((acc: any, order) => {
      const date = new Date(order.createdAt).toLocaleDateString();
      acc[date] = (acc[date] || 0) + order.totalAmount;
      return acc;
    }, {});

    const revenueChartData = Object.entries(revenueByDate).map(([date, amount]) => ({
      date,
      revenue: amount,
    }));

    const ordersByStatus = orders.reduce((acc: any, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    const statusChartData = Object.entries(ordersByStatus).map(([status, count]) => ({
      status: status === 'PENDING' ? 'Chờ xử lý' :
              status === 'APPROVED' ? 'Đã xác nhận' :
              status === 'COMPLETED' ? 'Hoàn thành' :
              status === 'CANCELLED' ? 'Đã hủy' : status,
      count,
    }));

    const productShareChartData = popularProducts.map(product => ({
      name: product.name,
      value: product.salesCount,
    }));

    setRevenueData(revenueChartData);
    setOrderStatusData(statusChartData);
    setProductShareData(productShareChartData);
  };

  useEffect(() => {
    const fetchRecentOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/orders/all', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        if (response.ok) {
          const data: Order[] = await response.json();
          setAllOrders(data);
          
          let filteredOrders = data;
          if (dateRange[0] && dateRange[1]) {
            filteredOrders = filterOrdersByDate(filteredOrders, dateRange[0], dateRange[1]);
          }
          filteredOrders = filterOrdersByQuarter(filteredOrders, quarter);
          
          const sortedOrders = filteredOrders
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);
          
          setRecentOrders(sortedOrders);
          
          const revenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
          setTotalRevenue(revenue);

          const productStats = new Map<string, PopularProduct>();
          
          filteredOrders.forEach(order => {
            order.orderItems.forEach(item => {
              const product = item.product;
              const existingStat = productStats.get(product.id) || {
                id: product.id,
                name: product.name,
                img_url: product.img_url,
                salesCount: 0,
                revenue: 0
              };

              existingStat.salesCount += item.quantity;
              existingStat.revenue += item.quantity * item.price;
              
              productStats.set(product.id, existingStat);
            });
          });

          const popularProductsArray = Array.from(productStats.values())
            .sort((a, b) => b.salesCount - a.salesCount)
            .slice(0, 5);

          setPopularProducts(popularProductsArray);
          prepareChartData(filteredOrders);
        } else {
          console.error('Failed to fetch orders:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
      setLoading(false);
    };

    fetchRecentOrders();
  }, [dateRange, quarter]);

  const productColumns = [
    {
      title: 'Sản phẩm',
      key: 'product',
      render: (record: PopularProduct) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img 
            src={record.img_url} 
            alt={record.name} 
            style={{ 
              width: '50px', 
              height: '50px', 
              objectFit: 'cover',
              borderRadius: '4px'
            }} 
          />
          <span>{record.name}</span>
        </div>
      ),
    },
    {
      title: 'Số lượng đã bán',
      dataIndex: 'salesCount',
      key: 'salesCount',
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (value: number) => `${value.toLocaleString('vi-VN')}đ`,
    },
  ];

  const orderColumns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `${amount.toLocaleString('vi-VN')}đ`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={
          status === 'PENDING' ? 'gold' :
            status === 'COMPLETED' ? 'green' :
              status === 'APPROVED' ? 'blue' :
          status === 'CANCELLED' ? 'red' : 'blue'
        }>
          {status === 'PENDING' ? 'Chờ xử lý' :
            status === 'COMPLETED' ? 'Hoàn thành' :
              status === 'APPROVED' ? 'Đã xác nhận' :
           status === 'CANCELLED' ? 'Đã hủy' : status}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
  ];

  const renderCharts = () => (
    <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
      <Col span={24}>
        <Card title="Biểu đồ doanh thu theo thời gian" style={cardStyle}>
          <LineChart width={1100} height={300} data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              formatter={(value) => `${value.toLocaleString('vi-VN')}đ`} 
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke={CHART_COLORS.primary}
              strokeWidth={3}
              dot={{ fill: CHART_COLORS.primary }}
              name="Doanh thu"
            />
          </LineChart>
        </Card>
      </Col>

      <Col span={12}>
        <Card title="Thống kê trạng thái đơn hàng" style={cardStyle}>
          <BarChart width={500} height={300} data={orderStatusData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="status" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Legend />
            <Bar 
              dataKey="count" 
              fill={CHART_COLORS.success}
              radius={[4, 4, 0, 0]}
              name="Số lượng"
            />
          </BarChart>
        </Card>
      </Col>

      <Col span={12}>
        <Card title="Tỷ lệ sản phẩm bán chạy" style={cardStyle}>
          <PieChart width={500} height={300}>
            <Pie
              data={productShareData}
              cx={250}
              cy={150}
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {productShareData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
          </PieChart>
        </Card>
      </Col>
    </Row>
  );

  return (
    <div style={{ padding: '24px', backgroundColor: '#f8fafc' }}>
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <Card style={cardStyle}>
            <Space size="large">
              <div>
                <span style={{ marginRight: '8px' }}>Khoảng thời gian:</span>
                <RangePicker
                  onChange={(dates) => {
                    setDateRange(dates ? [dates[0]?.toDate() || null, dates[1]?.toDate() || null] : [null, null]);
                  }}
                />
              </div>
              <div>
                <span style={{ marginRight: '8px' }}>Quý:</span>
                <Select
                  defaultValue="all"
                  style={{ width: 120 }}
                  onChange={setQuarter}
                >
                  <Option value="all">Tất cả</Option>
                  <Option value="Q1">Quý 1</Option>
                  <Option value="Q2">Quý 2</Option>
                  <Option value="Q3">Quý 3</Option>
                  <Option value="Q4">Quý 4</Option>
                </Select>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col span={6}>
          <Card style={{ ...statisticCardStyle, borderTop: `4px solid ${CHART_COLORS.primary}` }}>
            <Statistic
              title={<span style={{ color: '#6b7280', fontSize: '16px' }}>Tổng số người dùng</span>}
              value={statisticsData.totalUsers}
              prefix={<UserOutlined style={{ color: CHART_COLORS.primary }} />}
              valueStyle={{ color: '#111827', fontSize: '24px', fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ ...statisticCardStyle, borderTop: `4px solid ${CHART_COLORS.success}` }}>
            <Statistic
              title={<span style={{ color: '#6b7280', fontSize: '16px' }}>Tổng số sản phẩm</span>}
              value={statisticsData.totalProducts}
              prefix={<ShoppingOutlined style={{ color: CHART_COLORS.success }} />}
              valueStyle={{ color: '#111827', fontSize: '24px', fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ ...statisticCardStyle, borderTop: `4px solid ${CHART_COLORS.warning}` }}>
            <Statistic
              title={<span style={{ color: '#6b7280', fontSize: '16px' }}>Tổng số đơn hàng</span>}
              value={statisticsData.totalOrders}
              prefix={<ShoppingCartOutlined style={{ color: CHART_COLORS.warning }} />}
              valueStyle={{ color: '#111827', fontSize: '24px', fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ ...statisticCardStyle, borderTop: `4px solid ${CHART_COLORS.error}` }}>
            <Statistic
              title={<span style={{ color: '#6b7280', fontSize: '16px' }}>Tổng doanh thu</span>}
              value={totalRevenue}
              prefix={<DollarOutlined style={{ color: CHART_COLORS.error }} />}
              valueStyle={{ color: '#111827', fontSize: '24px', fontWeight: 600 }}
              formatter={(value) => `${value.toLocaleString('vi-VN')}đ`}
            />
          </Card>
        </Col>
      </Row>

      {renderCharts()}

      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col span={12}>
          <Card title="Sản phẩm bán chạy" style={cardStyle}>
            <Table 
              dataSource={popularProducts}
              columns={productColumns}
              pagination={false}
              size="small"
              rowKey="id"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Đơn hàng gần đây" style={cardStyle}>
            <Table 
              dataSource={recentOrders}
              columns={orderColumns}
              pagination={false}
              size="small"
              rowKey="id"
              loading={loading}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsManager;
