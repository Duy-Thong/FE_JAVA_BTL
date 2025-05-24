import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { QuestionCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { Popconfirm, Button, message } from 'antd';
import { UserProps } from '../../../interfaces/UserInterfaces';

interface DeleteUserButtonProps {
    userData: UserProps;
    onDeleteSuccess: () => void;
}

const DeleteUserButton: React.FC<DeleteUserButtonProps> = ({ userData, onDeleteSuccess }) => {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const showPopconfirm = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setConfirmLoading(true);
        const deleteApiUrl = `http://localhost:8080/api/admin/users/delete`;
        console.log(`${deleteApiUrl}?id=${userData.id}`);

        axios
            .delete(`${deleteApiUrl}?id=${userData.id}`)
            .then((response) => {
                console.log(response);
                message.success('User deleted');
                onDeleteSuccess();
            })
            .catch((err) => {
                message.error('Error while deleting user');
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
            title={`Delete user ${userData.id}`}
            description="Open Popconfirm with async logic"
            open={open}
            okText="Delete"
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

export default DeleteUserButton;
