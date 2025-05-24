package com.javaBTL.BE_JAVA_BTL.repository;

import com.javaBTL.BE_JAVA_BTL.model.discount.Discount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DiscountRepository extends JpaRepository<Discount, UUID> {
    Optional<Discount> findByCode(String code);
    
    @Query("SELECT d FROM Discount d WHERE d.isActive = true AND d.startDate <= ?1 AND d.endDate >= ?1")
    List<Discount> findActiveDiscounts(LocalDateTime now);
    
    List<Discount> findByIsActiveOrderByCreatedAtDesc(boolean isActive);
} 