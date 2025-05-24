package com.javaBTL.BE_JAVA_BTL.repository;

import com.javaBTL.BE_JAVA_BTL.model.product.Product;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {
    List<Product> findProductsByCategory(String category);
    @Query("SELECT p FROM Product p WHERE p.name LIKE %:keyword%")
    List<Product> searchProducts(@Param("keyword") String keyword);
    @Query("SELECT p FROM Product p WHERE p.category LIKE %:category%")
    List<Product> getProductsByCategory(@Param("category") String category);

    @Modifying
    @Transactional
    @Query("DELETE FROM Product p WHERE p.category = :category")
    void deleteProductsByCategory(@Param("category") String category);
}