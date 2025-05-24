package com.javaBTL.BE_JAVA_BTL.service.productDAO;

import com.javaBTL.BE_JAVA_BTL.model.product.Product;

import java.util.List;
import java.util.UUID;

public interface ProductService {
    Product createProduct(Product product);
    Product createOrUpdateProduct(UUID id, Product product);
    List<Product> uploadProducts(List<Product> products);
    List<Product> getAllProducts();
    List<Product> getAllLaptops();
    Product getProductById(UUID id);
    List<Product> searchProducts(String keyword); // Thêm phương thức cho tìm kiếm sản phẩm
    List<Product> getProductsByCategory(String category);
    void deleteProduct(UUID id); // Thêm phương thức cho xóa sản phẩm

    void deleteAllProducts();

    void deleteProductsByCategory(String category);
}