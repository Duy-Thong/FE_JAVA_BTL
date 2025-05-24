import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, message, DatePicker, Select, InputNumber, Switch } from 'antd';
import type { Discount } from '../../../types/Discount';
import moment from 'moment';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const DiscountManager: React.FC<{ discountsData: Discount[] }> = ({
    discountsData,
}) => {
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingDiscount, setEditingDiscount] = useState<Discount | null>(
        null,
    );
    const [discounts, setDiscounts] = useState<Discount[]>(discountsData);

    const handleAdd = () => {
        setEditingDiscount(null);
        form.resetFields();
        setVisible(true);
    };

    const handleEdit = (discount: Discount) => {
        setEditingDiscount(discount);
        form.setFieldsValue({
            ...discount,
            startDate: moment(discount.startDate),
            endDate: moment(discount.endDate),
        });
        setVisible(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await fetch(`http://localhost:8080/api/discounts/${id}`, {
                method: 'DELETE',
            });
            // Update local state immediately after successful deletion
            setDiscounts(prevDiscounts => prevDiscounts.filter(discount => discount.id !== id));
            message.success('Mã giảm giá đã được xóa thành công');
        } catch (error) {
            message.error('Có lỗi xảy ra khi xóa mã giảm giá');
        }
    };

    const handleSubmit = async (values: Discount) => {
        try {
            const formattedValues = {
                ...values,
                startDate: values.startDate?.toISOString(),
                endDate: values.endDate?.toISOString(),
            };

            if (editingDiscount) {
                // Cập nhật mã giảm giá
                const response = await fetch(
                    `http://localhost:8080/api/discounts/${editingDiscount.id}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formattedValues),
                    },
                );
                const updatedDiscount = await response.json();
                // Update local state with the updated discount
                setDiscounts(prevDiscounts =>
                    prevDiscounts.map(discount =>
                        discount.id === editingDiscount.id ? updatedDiscount : discount
                    )
                );
                message.success('Mã giảm giá đã được cập nhật thành công');
            } else {
                // Tạo mã giảm giá mới
                const response = await fetch(`http://localhost:8080/api/discounts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formattedValues),
                });
                const newDiscount = await response.json();
                // Add new discount to local state
                setDiscounts(prevDiscounts => [...prevDiscounts, newDiscount]);
                message.success('Mã giảm giá đã được tạo thành công');
            }
            setVisible(false);
            form.resetFields();
        } catch (error) {
            message.error('Có lỗi xảy ra khi lưu mã giảm giá');
        }
    };

    const columns = [
        { title: 'Mã', dataIndex: 'code', key: 'code' },
        { title: 'Tên', dataIndex: 'name', key: 'name' },
        { title: 'Mô tả', dataIndex: 'description', key: 'description' },
        { 
            title: 'Loại', 
            dataIndex: 'type', 
            key: 'type',
            render: (type: string) => type === 'FIXED_AMOUNT' ? 'Giảm theo số tiền' : 'Giảm theo phần trăm'
        },
        { 
            title: 'Giá trị', 
            dataIndex: 'value', 
            key: 'value',
            render: (value: number, record: Discount) => 
                record.type === 'FIXED_AMOUNT' ? `${value.toLocaleString()} VNĐ` : `${value}%`
        },
        { 
            title: 'Giảm tối đa', 
            dataIndex: 'maxDiscountAmount', 
            key: 'maxDiscountAmount',
            render: (value: number) => value ? `${value.toLocaleString()} VNĐ` : 'Không giới hạn'
        },
        { 
            title: 'Đơn hàng tối thiểu', 
            dataIndex: 'minOrderAmount', 
            key: 'minOrderAmount',
            render: (value: number) => value ? `${value.toLocaleString()} VNĐ` : 'Không giới hạn'
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (active: boolean) => active ? 'Đang hoạt động' : 'Đã khóa'
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (date) => moment(date).format('YYYY-MM-DD'),
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (date) => moment(date).format('YYYY-MM-DD'),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <div className="flex gap-2">
                    <Button
                        type="default"
                        icon={<EditOutlined className="text-blue-500" />}
                        onClick={() => handleEdit(record)}
                        className="border-blue-500 text-blue-500 hover:text-blue-600 hover:border-blue-600"
                    >
                        Sửa
                    </Button>
                    <Button
                        type="default"
                        icon={<DeleteOutlined className="text-red-500" />}
                        onClick={() => handleDelete(record.id)}
                        className="border-red-500 text-red-500 hover:text-red-600 hover:border-red-600"
                    >
                        Xóa
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-8 bg-white rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý mã giảm giá</h1>
                <Button
                    type="default"
                    icon={<PlusOutlined className="text-blue-500" />}
                    onClick={handleAdd}
                    className="flex items-center gap-2 border-blue-500 text-blue-500 hover:text-blue-600 hover:border-blue-600"
                    size="large"
                >
                    Thêm mã giảm giá
                </Button>
            </div>

            <Table
                dataSource={discounts} // Use local state instead of props
                rowKey="id"
                columns={columns}
                className="shadow-sm rounded-lg overflow-hidden"
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mục`,
                    className: "p-4"
                }}
            />

            <Modal
                title={
                    <span className="text-xl font-bold text-gray-800">
                        {editingDiscount ? 'Sửa mã giảm giá' : 'Thêm mã giảm giá'}
                    </span>
                }
                visible={visible}
                onCancel={() => setVisible(false)}
                footer={null}
                className="rounded-xl"
                width={700}
            >
                <Form
                    form={form}
                    onFinish={handleSubmit}
                    layout="vertical"
                    className="space-y-6 pt-4"
                >
                    <div className="grid grid-cols-2 gap-6">
                        <Form.Item name="code" label="Mã" rules={[{ required: true }]}>
                            <Input className="rounded-lg shadow-sm" />
                        </Form.Item>
                        <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
                            <Input className="rounded-lg shadow-sm" />
                        </Form.Item>
                    </div>

                    <Form.Item name="description" label="Mô tả">
                        <Input.TextArea className="rounded-lg shadow-sm" rows={4} />
                    </Form.Item>

                    <div className="grid grid-cols-2 gap-6">
                        <Form.Item name="type" label="Loại" rules={[{ required: true }]}>
                            <Select className="rounded-lg shadow-sm">
                                <Select.Option value="FIXED_AMOUNT">Giảm theo số tiền</Select.Option>
                                <Select.Option value="PERCENTAGE">Giảm theo phần trăm</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="value" label="Giá trị" rules={[{ required: true }]}>
                            <InputNumber min={0} className="w-full rounded-lg shadow-sm" />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <Form.Item name="maxDiscountAmount" label="Giảm tối đa">
                            <InputNumber min={0} className="w-full rounded-lg shadow-sm" />
                        </Form.Item>
                        <Form.Item name="minOrderAmount" label="Đơn hàng tối thiểu">
                            <InputNumber min={0} className="w-full rounded-lg shadow-sm" />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <Form.Item
                            name="startDate"
                            label="Ngày bắt đầu"
                            rules={[{ required: true }]}
                        >
                            <DatePicker className="w-full rounded-lg shadow-sm" />
                        </Form.Item>
                        <Form.Item
                            name="endDate"
                            label="Ngày kết thúc"
                            rules={[{ required: true }]}
                        >
                            <DatePicker className="w-full rounded-lg shadow-sm" />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <Form.Item name="maxUsage" label="Số lần sử dụng tối đa">
                            <InputNumber min={0} className="w-full rounded-lg shadow-sm" />
                        </Form.Item>
                        <Form.Item name="isActive" label="Kích hoạt" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </div>

                    <Form.Item className="flex justify-end mb-0 pt-4 border-t">
                        <Button
                            type="default"
                            onClick={() => setVisible(false)}
                            className="mr-4 border-gray-400 text-gray-600 hover:text-gray-800 hover:border-gray-600"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="default"
                            htmlType="submit"
                            className="border-blue-500 text-blue-500 hover:text-blue-600 hover:border-blue-600"
                        >
                            {editingDiscount ? 'Cập nhật' : 'Tạo'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DiscountManager;
