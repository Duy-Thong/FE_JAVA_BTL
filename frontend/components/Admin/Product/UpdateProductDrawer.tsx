'use client';
import axios from 'axios';
import React, { useState } from 'react';
import { EditOutlined } from '@ant-design/icons';
import {
    Button,
    Col,
    message,
    Drawer,
    Form,
    Input,
    Row,
    Select,
    Space,
} from 'antd';
const { Option } = Select;
import { ProductProps } from '@/interfaces/ProductInterfaces';
interface ThisProps {
    productData: ProductProps;
}

const UpdateProductDrawer: React.FC<ThisProps> = ({ productData }) => {
    const [open, setOpen] = useState(false);
    const [formValues, setFormValues] = useState({
        url: productData.url,
        name: productData.name,
        img_url: productData.img_url,
        price: productData.price,
        category: productData.category,
    });

    const handleSubmitForm = () => {
        const addApiUrl = `http://localhost:8080/api/admin/product/${productData.id}`;
        if (
            formValues.name === '' ||
            formValues.img_url === '' ||
            formValues.price === ''
        ) {
            message.error('Please fill in all required fields.');
            return;
        }
        console.log(formValues);

        axios
            .post(addApiUrl, formValues)
            .then((response) => {
                console.log('Success:', response.data);
                message.success('Product update successfully');
                setTimeout(() => {
                    setOpen(false);
                }, 500);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        // After a successful action, you can close the drawer
    };

    const showDrawer = () => {
        console.log('EDITING THIS PRODUCT', productData);
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Button
                className="mr-2"
                type="default"
                onClick={showDrawer}
                icon={<EditOutlined />}
            ></Button>
            <Drawer
                title={`Cập nhật sản phẩm`}
                width={600}
                onClose={onClose}
                open={open}
                extra={
                    <Space>
                        <Button onClick={onClose}>Hủy</Button>
                        <Button onClick={handleSubmitForm} type="default">
                            Cập nhật
                        </Button>
                    </Space>
                }
            >
                <Form layout="vertical">
                    <Row gutter={16}>
                        <Col span={20}>
                            <Form.Item
                                name="name"
                                label="Tên sản phẩm"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tên sản phẩm',
                                    },
                                ]}
                            >
                                <Input
                                    value={formValues.name}
                                    defaultValue={formValues.name}
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
                                name="img_url"
                                label="Đường dẫn hình ảnh"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập đường dẫn hình ảnh',
                                    },
                                ]}
                            >
                                <Input
                                    value={formValues.img_url}
                                    defaultValue={formValues.img_url}
                                    onChange={(e) =>
                                        setFormValues({
                                            ...formValues,
                                            img_url: e.target.value,
                                        })
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={20}>
                            <Form.Item
                                name="price"
                                label="Giá"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập giá sản phẩm',
                                    },
                                ]}
                            >
                                <Input
                                    value={formValues.price}
                                    defaultValue={formValues.price}
                                    onChange={(e) =>
                                        setFormValues({
                                            ...formValues,
                                            price: e.target.value,
                                        })
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={20}>
                            <Form.Item
                                name="category"
                                label="Danh mục"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn danh mục',
                                    },
                                ]}
                            >
                                <Select
                                    value={formValues.category}
                                    defaultValue={formValues.category}
                                    onChange={(value) =>
                                        setFormValues({
                                            ...formValues,
                                            category: value,
                                        })
                                    }
                                >
                                    <Option value="laptop">Máy tính xách tay</Option>
                                    <Option value="phone">Điện thoại</Option>
                                    <Option value="tablet">Máy tính bảng</Option>
                                    <Option value="book">Sách</Option>
                                    <Option value="clothing">Quần áo</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </>
    );
};

export default UpdateProductDrawer;
