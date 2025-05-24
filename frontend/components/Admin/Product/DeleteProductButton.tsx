import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { QuestionCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { Popconfirm, Button, message } from 'antd';
import { ProductProps } from '@/interfaces/ProductInterfaces';
interface ThisProps {
    productData: ProductProps;
}

const DeleteProductButton: React.FC<ThisProps> = ({ productData }) => {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const showPopconfirm = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setConfirmLoading(true);
        const deleteApiUrl = `http://localhost:8080/api/admin/product/delete`;
        console.log(`${deleteApiUrl}/${productData.id}`);

        axios
            .delete(`${deleteApiUrl}/${productData.id}`)
            .then((response) => {
                console.log(response);
                message.success('Đã xóa sản phẩm thành công');
            })
            .catch((err) => {
                message.error('Có lỗi xảy ra khi xóa sản phẩm');
                console.error(err);
            })
            .finally(() => {
                setOpen(false);
                setConfirmLoading(false);
            });
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <Popconfirm
            placement="topRight"
            okType="danger"
            title={`Xóa sản phẩm ${productData.id}`}
            description="Bạn có chắc chắn muốn xóa sản phẩm này?"
            open={open}
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={handleOk}
            okButtonProps={{ loading: confirmLoading }}
            onCancel={handleCancel}
        >
            <Button
                danger
                onClick={showPopconfirm}
                icon={<DeleteOutlined />}
            ></Button>
        </Popconfirm>
    );
};

export default DeleteProductButton;
