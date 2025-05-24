'use client';
import { useState } from 'react';
import { Form, Input, Button, message, Card, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Update this line

interface LoginRequest {
  email: string;
  password: string;
}

interface JwtPayload {
  sub: string;
  email: string;
  role: string;  // This will now be included in the token
  iat: number;
  exp: number;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdDate: string;
  lastModifiedDate: string;
}

const AdminLogin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { Title } = Typography;

  const handleRedirect = (role: string) => {
    console.log('Redirecting with role:', role);
    switch (role.toLowerCase()) {  // Change to toLowerCase()
      case 'admin':
        router.push('/admin');
        break;
      case 'shipper':
        router.push('/shipper');
        break;
      case 'manager':
        console.log('Detected manager role, redirecting to /manager');
        router.push('/manager');
        break;
      default:
        console.log('Invalid role detected:', role);
        message.error('Invalid role');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    }
  };

  const fetchUserByEmail = async (email: string): Promise<User> => {
    try {
      const response = await axios.get(`http://localhost:8080/api/client/users/email/${email}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  };

  const onFinish = async (values: LoginRequest) => {
    setLoading(true);
    try {
      console.log('Attempting login with:', values.email);
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email: values.email,
        password: values.password
      });
      
      const token = response.data;
      console.log('Token:', token);
      
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        console.log('Decoded token:', decoded);
        
        // Fetch user details using email from token
        const user = await fetchUserByEmail(decoded.email);
        console.log('Fetched user:', user);
        
        if (!user.role) {
          message.error('Role information missing');
          return;
        }
        
        localStorage.setItem('token', token);
        localStorage.setItem('role', user.role);
        localStorage.setItem('user', JSON.stringify(user));
        
        message.success('Login successful');
        handleRedirect(user.role);
      } catch (decodeError) {
        console.error('Token decode or user fetch error:', decodeError);
        message.error('Authentication failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      // Backend specific error messages
      const errorMessage = error.response?.data || 'Login failed';
      if (errorMessage === 'User not found') {
        message.error('User not found');
      } else if (errorMessage === 'Incorrect password') {
        message.error('Incorrect password');
      } else {
        message.error('Login failed');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-50 flex items-center justify-center p-4">
      <Card 
        className="w-full max-w-md shadow-2xl"
        bordered={false}
      >
        <div className="text-center mb-8">
          <Title level={2} className="!mb-2">Welcome Back</Title>
          <Typography.Text className="text-gray-500">
            Please sign in to your account
          </Typography.Text>
        </div>

        <Form
          name="admin_login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Email"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password 
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Password"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Button 
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="h-12 rounded-lg bg-blue-600 hover:bg-blue-700"
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdminLogin;

