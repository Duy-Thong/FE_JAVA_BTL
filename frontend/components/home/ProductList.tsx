import React, { useState, useMemo } from 'react';
import { Card, Select, Layout, Typography, Pagination, Row, Col, Space, Empty } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import ProductCard from './ProductCard';
import { useDiscounts } from '@/hooks/useDiscounts';
import PromotionSlider from './PromotionSlider'; // Add this import
import Banner from './Banner';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

interface Product {
  id: string;
  retailer: string;
  img_url: string;
  name: string;
  price: string;
  url: string;
  category: string;
  discountCode?: string;
  discountValue?: number;
  discountType?: 'FIXED_AMOUNT' | 'PERCENTAGE';
}

const ProductList = (props: any) => {
  const { productData } = props;
  const { discounts } = useDiscounts();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortOrder, setSortOrder] = useState('none');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(32); // Changed from 8 to 32
  // Removed showDiscounted state

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(productData?.map((p: Product) => p.category));
    return ['all', ...Array.from(cats)];
  }, [productData]);

  // Add category mapping
  const categoryLabels: { [key: string]: string } = {
    'all': 'Tất cả danh mục',
    'laptop': 'Máy tính xách tay',
    'mobile': 'Điện thoại di động',
    'tablet': 'Máy tính bảng'
  };

  // Update filteredProducts to include discount filtering
  const filteredProducts = useMemo(() => {
    if (!productData) return [];
    
    let filtered = productData.filter((product: Product) => {
      const priceStr = String(product.price);
      const price = parseFloat(priceStr.replace(/[^0-9.-]+/g, '')) || 0;
      
      const matchCategory = selectedCategory === 'all' || product.category === selectedCategory;
      let matchPrice = true;
      const matchDiscount = true; // Removed discount filtering

      switch (priceRange) {
        case 'under5m':
          matchPrice = price < 5000000;
          break;
        case '5m-10m':
          matchPrice = price >= 5000000 && price <= 10000000;
          break;
        case '10m-20m':
          matchPrice = price > 10000000 && price <= 20000000;
          break;
        case 'over20m':
          matchPrice = price > 20000000;
          break;
      }

      return matchCategory && matchPrice && matchDiscount;
    });

    // Add sorting
    if (sortOrder !== 'none') {
      filtered.sort((a, b) => {
        const priceA = parseFloat(String(a.price).replace(/[^0-9.-]+/g, '')) || 0;
        const priceB = parseFloat(String(b.price).replace(/[^0-9.-]+/g, '')) || 0;
        return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
      });
    }

    return filtered;
  }, [productData, selectedCategory, priceRange, sortOrder]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSizeChange = (current: number, size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1); // Reset to first page when changing size
  };

  return (
      <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-6 lg:px-8">
          {/* Add PromotionSlider at the top */}
          <PromotionSlider />

          {/* Filters Section */}
          <div className="mb-8 bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-6">
                      <FilterOutlined className="text-primary text-xl" />
                      <Text className="text-lg font-semibold">Bộ lọc tìm kiếm</Text>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* Category Filter */}
                      <div className="filter-group">
                          <Text className="block mb-3 font-medium text-gray-700">Danh mục sản phẩm</Text>
                          <Select
                              className="w-full"
                              value={selectedCategory}
                              onChange={setSelectedCategory}
                              size="large"
                              placeholder="Chọn danh mục"
                          >
                              {categories.map((cat) => (
                                  <Option key={cat} value={cat}>
                                      {categoryLabels[cat] || cat}
                                  </Option>
                              ))}
                          </Select>
                      </div>

                      {/* Price Range Filter */}
                      <div className="filter-group">
                          <Text className="block mb-3 font-medium text-gray-700">Khoảng giá</Text>
                          <Select
                              className="w-full"
                              value={priceRange}
                              onChange={setPriceRange}
                              size="large"
                              placeholder="Chọn khoảng giá"
                          >
                              <Option value="all">Tất cả mức giá</Option>
                              <Option value="under5m">Dưới 5 triệu</Option>
                              <Option value="5m-10m">5 - 10 triệu</Option>
                              <Option value="10m-20m">10 - 20 triệu</Option>
                              <Option value="over20m">Trên 20 triệu</Option>
                          </Select>
                      </div>

                      {/* Sort Order */}
                      <div className="filter-group">
                          <Text className="block mb-3 font-medium text-gray-700">Sắp xếp theo</Text>
                          <Select
                              className="w-full"
                              value={sortOrder}
                              onChange={setSortOrder}
                              size="large"
                              placeholder="Chọn cách sắp xếp"
                          >
                              <Option value="none">Mặc định</Option>
                              <Option value="asc">Giá thấp đến cao</Option>
                              <Option value="desc">Giá cao đến thấp</Option>
                          </Select>
                      </div>
                  </div>
              </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
              <Empty
                  description="Không tìm thấy sản phẩm nào"
                  className="my-12"
              />
          ) : (
              <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {paginatedProducts.map((product: Product) => (
                      <div
                          key={product.id}
                          className="transform transition-transform duration-300 hover:-translate-y-2"
                      >
                          <ProductCard data={product} />
                      </div>
                  ))}
              </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
              <div className="mt-8 flex justify-center rounded-lg bg-white p-4 shadow-sm">
                  <Pagination
                      current={currentPage}
                      total={filteredProducts.length}
                      pageSize={itemsPerPage}
                      onChange={handlePageChange}
                      onShowSizeChange={handleSizeChange}
                      showSizeChanger={true}
                      showTotal={(total) => `Tổng ${total} sản phẩm`}
                      pageSizeOptions={['8', '16', '24', '32']}
                  />
              </div>
          )}
      </div>
  );
};

export default ProductList;
