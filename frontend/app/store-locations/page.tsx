'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const StoreLocations: React.FC = () => {
    const router = useRouter();
    const locations = [
        { 
            id: 1, 
            name: 'Cửa hàng Royal City', 
            address: 'Tầng B1, TTTM Royal City, 72A Nguyễn Trãi, Thanh Xuân, Hà Nội',
            phone: '024 1234 5678',
            position: { lat: 21.002506, lng: 105.815380 }
        },
        { 
            id: 2, 
            name: 'Cửa hàng Times City', 
            address: 'Tầng B1, TTTM Times City, 458 Minh Khai, Hai Bà Trưng, Hà Nội',
            phone: '024 8765 4321',
            position: { lat: 20.995587, lng: 105.868668 }
        },
        { 
            id: 3, 
            name: 'Cửa hàng Vincom Bà Triệu', 
            address: 'Tầng 5, TTTM Vincom Center, 191 Bà Triệu, Hai Bà Trưng, Hà Nội',
            phone: '024 1122 3344',
            position: { lat: 21.011875, lng: 105.849244 }
        },
        { 
            id: 4, 
            name: 'PTIT - Học viện Công nghệ Bưu chính viễn thông', 
            address: '122 Hoàng Quốc Việt, Cầu Giấy, Hà Nội',
            phone: '024 3756 4321',
            position: { lat: 20.981310, lng: 105.787402 }
        }
    ];

    return (
        <div className="container mx-auto p-4">
            <button
                onClick={() => router.back()}
                className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Trở về
            </button>

            <h1 className="text-3xl font-bold mb-6">Hệ Thống Cửa Hàng</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-lg p-4">
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1490.3398766743367!2d105.78740153519001!3d20.981309788295132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135accdd8a1ad71%3A0xa2f9b16036648187!2zSOG7jWMgdmnhu4duIEPDtG5nIG5naOG7hyBCxrB1IGNow61uaCB2aeG7hW4gdGjDtG5n!5e1!3m2!1svi!2s!4v1735724049975!5m2!1svi!2s"
                        className="w-full h-[500px]"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>

                <div className="space-y-4">
                    {locations.map(location => (
                        <div 
                            key={location.id}
                            className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow"
                        >
                            <h2 className="text-xl font-semibold text-gray-800">{location.name}</h2>
                            <p className="text-gray-600 mt-2">{location.address}</p>
                            {location.phone && (
                                <p className="text-gray-600 mt-1">
                                    <span className="font-medium">Điện thoại:</span> {location.phone}
                                </p>
                            )}
                            <div className="mt-3 flex space-x-3">
                                <a 
                                    href={`https://www.google.com/maps/search/${encodeURIComponent(location.address)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Xem chỉ đường
                                </a>
                                <a 
                                    href={`tel:${location.phone}`} 
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                >
                                    Gọi ngay
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StoreLocations;