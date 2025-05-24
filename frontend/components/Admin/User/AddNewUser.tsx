import React, { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
    message,
    Button,
    Col,
    Drawer,
    Form,
    Input,
    Row,
    Select,
    Space,
} from 'antd';
import axios from 'axios';

const { Option } = Select;

const AddNewUser: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [formValues, setFormValues] = useState({
        name: '',
        password: '',
        email: '',
        role: 'client',
    });

    const handleSubmitForm = () => {
        const addApiUrl = 'http://localhost:8080/api/admin/users/add';
        if (
            formValues.name === '' ||
            formValues.password === '' ||
            formValues.email === ''
        ) {
            message.error('Vui lòng điền đầy đủ thông tin.');
            console.log(
                '🚀 ~ file: AddNewUser.tsx:22 ~ handleSubmitForm ~ formValues:',
                formValues,
            );
            return;
        }

        axios
            .post(addApiUrl, formValues)
            .then((response) => {
                console.log('Success:', response.data);
                setTimeout(() => {
                    setOpen(false);
                }, 500);
                message.success(response.data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        // After a successful action, you can close the drawer
    };

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Button type="default" onClick={showDrawer} icon={<PlusOutlined />}>
                Thêm người dùng
            </Button>
            <Drawer
                title={`Thêm người dùng mới`}
                width={600}
                onClose={onClose}
                open={open}
                extra={
                    <Space>
                        <Button onClick={onClose}>Hủy</Button>
                        <Button onClick={handleSubmitForm} type="default">
                            Tạo mới
                        </Button>
                    </Space>
                }
            >
                <Form layout="vertical">
                    <Row gutter={16}>
                        <Col span={20}>
                            <Form.Item
                                name="name"
                                label="Họ tên"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập họ tên',
                                    },
                                ]}
                            >
                                <Input
                                    value={formValues.name}
                                    onChange={(e) =>
                                        setFormValues({
                                            ...formValues,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={20}>
                            <Form.Item
                                name="password"
                                label="Mật khẩu"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập mật khẩu',
                                    },
                                ]}
                            >
                                <Input
                                    value={formValues.password}
                                    onChange={(e) =>
                                        setFormValues({
                                            ...formValues,
                                            password: e.target.value,
                                        })
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={20}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập email',
                                    },
                                ]}
                            >
                                <Input
                                    value={formValues.email}
                                    onChange={(e) =>
                                        setFormValues({
                                            ...formValues,
                                            email: e.target.value,
                                        })
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={20}>
                            <Form.Item
                                name="role"
                                label="Vai trò"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn vai trò',
                                    },
                                ]}
                            >
                                <Select
                                    value={formValues.role}
                                    onChange={(value) =>
                                        setFormValues({
                                            ...formValues,
                                            role: value,
                                        })
                                    }
                                >
                                    <Option value="client">Khách hàng</Option>
                                    <Option value="admin">Quản trị viên</Option>
                                    <Option value="shipper">Người giao hàng</Option>
                                    <Option value="manager">Quản lý</Option>
                                    <Option value="saler">Nhân viên bán hàng</Option>
                                    
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </>
    );
};

export default AddNewUser;
