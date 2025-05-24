import React from 'react';
import { Descriptions } from 'antd';
import type { DescriptionsProps } from 'antd';

const hardwareItems: DescriptionsProps['items'] = [
    {
        key: 'cpu',
        label: 'CPU',
        children: 'i9-12900H 2.5GHz',
    },
    {
        key: 'ram',
        label: 'RAM',
        children: '32 GB DDR5 2 khe (1 khe 16 GB + 1 khe 16 GB) 4800 MHz',
    },
    {
        key: 'storage',
        label: 'Ổ cứng',
        children:
            '1 TB SSD M.2 PCIe Gen 4 (Có thể tháo ra, lắp thanh khác tối đa 2 TB) Hỗ trợ thêm 1 khe cắm SSD M.2 PCIe Gen 4 mở rộng (nâng cấp tối đa 2 TB)',
    },
    {
        key: 'display',
        label: 'Màn hình',
        children: '15.6" WQHD (2560 x 1440) 240Hz',
    },
    {
        key: 'gpu',
        label: 'Card màn hình',
        children: 'Card rời RTX 3070Ti 8GB',
    },
    {
        key: 'ports',
        label: 'Cổng kết nối',
        children:
            '1 x Thunderbolt 4 (hỗ trợ DisplayPort) 1 x USB 3.2 Gen 2 Type-C (hỗ trợ DisplayPort, Power delivery, G-SYNC) HDMI LAN (RJ45) 2 x USB 3.2 Jack tai nghe 3.5 mm',
    },
    {
        key: 'special',
        label: 'Đặc biệt',
        children: 'Có đèn bàn phím',
    },
    {
        key: 'os',
        label: 'Hệ điều hành',
        children: 'Windows 11 Home SL',
    },
    {
        key: 'design',
        label: 'Thiết kế',
        children: 'Vỏ nhựa - nắp lưng bằng kim loại',
    },
    {
        key: 'size',
        label: 'Kích thước, khối lượng',
        children: 'Dài 354 mm - Rộng 259 mm - Dày 22.6 ~ 27.2 mm - Nặng 2.3 kg',
    },
    {
        key: 'release',
        label: 'Thời điểm ra mắt',
        children: '2022',
    },
];

const OtherInfo = () => {
    return (
        <div className="mt-2 w-full">
            <Descriptions title="Thông tin phần cứng" items={hardwareItems} />
        </div>
    );
};

export default OtherInfo;
