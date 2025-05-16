import React, { useState } from 'react';
import axios from 'axios';
import { Table, Popconfirm, Button, Tag } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';

import DeleteUserButton from './DeleteUserButton';
import UpdateUserDrawer from './UpdateUserDrawer';
import {
    UserManagerProps,
    UserProps,
} from '../../../interfaces/UserInterfaces';

const UserManager: React.FC<UserManagerProps> = ({ usersData }) => {
    const [users, setUsers] = useState<UserProps[]>(usersData);

    const updateUsersList = (updatedUser: UserProps) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === updatedUser.id ? updatedUser : user,
            ),
        );
    };

    const addUser = (newUser: UserProps) => {
        setUsers((prevUsers) => [...prevUsers, newUser]);
    };

    const deleteUser = (userId: string) => {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    };

    const columns: ColumnsType<UserProps> = [
        { title: 'Mã người dùng', dataIndex: 'id', key: 'id' },
        {
            title: 'Họ tên',
            dataIndex: 'name',
            key: 'name',
            sorter: (a: UserProps, b: UserProps) =>
                (a.name || '').localeCompare(b.name || ''),
            filterSearch: true,
            filters: usersData.map((user) => ({
                text: user.name,
                value: user.name,
            })),
            onFilter: (value: React.Key | boolean, record: UserProps) =>
                record.name?.includes(String(value)) || false,
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            filters: [
                { text: 'Khách hàng', value: 'client' },
                { text: 'Quản trị viên', value: 'admin' },
                { text: 'Người giao hàng', value: 'shipper' },
                { text: 'Người quản lý', value: 'manager' },
                { text: 'Nhân viên bán hàng', value: 'saler' },
            ],
            onFilter: (value: React.Key | boolean, record: UserProps) =>
                record.role === value,
            filterSearch: true,
            render: (role: string | null) => {
                const roleConfig = {
                    client: { color: 'blue', label: 'Khách hàng' },
                    admin: { color: 'red', label: 'Quản trị viên' },
                    shipper: { color: 'green', label: 'Người giao hàng' },
                    manager: { color: 'purple', label: 'Người quản lý' },
                    saler: { color: 'orange', label: 'Nhân viên bán hàng' },
                };

                const config = role
                    ? roleConfig[role as keyof typeof roleConfig]
                    : { color: 'default', label: 'Unknown' };
                return <Tag color={config.color}>{config.label}</Tag>;
            },
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: (a: UserProps, b: UserProps) =>
                (a.email || '').localeCompare(b.email || ''),
            filterSearch: true,
            filters: usersData.map((user) => ({
                text: user.email,
                value: user.email,
            })),
            onFilter: (value: React.Key | boolean, record: UserProps) =>
                record.email?.includes(String(value)) || false,
        },
        {
            title: 'Ngày chỉnh sửa cuối',
            dataIndex: 'lastModifiedDate',
            sorter: {
                compare: (a: UserProps, b: UserProps) => {
                    const dateA = a.modifiedDate
                        ? new Date(a.modifiedDate).getTime()
                        : 0;
                    const dateB = b.modifiedDate
                        ? new Date(b.modifiedDate).getTime()
                        : 0;
                    return dateA - dateB;
                },
                multiple: 1,
            },
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (user: UserProps) => (
                <div>
                    <UpdateUserDrawer
                        userData={user}
                        onUpdateSuccess={updateUsersList}
                    />
                    <DeleteUserButton
                        userData={user}
                        onDeleteSuccess={() => deleteUser(user.id)}
                    />
                </div>
            ),
        },
    ];

    const handleDelete = (userId: string) => {
        console.log('DELETE USER W ID: ', userId);
    };

    const onChange: TableProps<UserProps>['onChange'] = (
        pagination,
        filters,
        sorter,
        extra,
    ) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    return (
        <div className="text-black">
            <Table
                columns={columns}
                onChange={onChange}
                dataSource={users}
                bordered
            />
        </div>
    );
};

export default UserManager;
