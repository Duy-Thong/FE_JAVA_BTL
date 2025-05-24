package com.javaBTL.BE_JAVA_BTL.service.productDAO;

import com.javaBTL.BE_JAVA_BTL.model.product.Product;
import com.javaBTL.BE_JAVA_BTL.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ProductServiceImpl implements ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Override
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public Product createOrUpdateProduct(UUID id, Product product) {
        if (productRepository.existsById(id)) {
            // Cập nhật sản phẩm theo id
            product.setId(id);
            return productRepository.save(product);
        } else {
            // Tạo sản phẩm mới với id mới
            return productRepository.save(product);
        }
    }
    @Override
    public List<Product> uploadProducts(List<Product> products) {
        // Iterate through the list of products and save each one
        for (Product product : products) {
            UUID id = product.getId();
            if (id != null && productRepository.existsById(id)) {
                // If the product with this ID exists, update it
                productRepository.save(product);
            } else {
                // If the product doesn't have an ID or it doesn't exist, create a new one
                product.setId(UUID.randomUUID()); // Assign a new UUID
                productRepository.save(product);
            }
        }
        return products;
    }
    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public List<Product> getAllLaptops() {
        return productRepository.findProductsByCategory("laptop");
    }

    @Override
    public Product getProductById(UUID id) {
        return productRepository.findById(id).orElse(null);
    }

    @Override
    public List<Product> searchProducts(String keyword) {
        // Triển khai logic tìm kiếm sản phẩm dựa trên từ khóa ở đây và trả về danh sách sản phẩm tương ứng
        return productRepository.searchProducts(keyword);
    }


    @Override
    public void deleteProduct(UUID id) {
        // Triển khai logic xóa sản phẩm theo ID ở đây
        productRepository.deleteById(id);
    }
    public List<Product> getProductsByCategory(String category){
        return productRepository.getProductsByCategory(category);
    }
    @Override
    public void deleteAllProducts() {
        productRepository.deleteAll();
    }
    @Override
    public void deleteProductsByCategory(String category) {
        productRepository.deleteProductsByCategory(category);
    }


}