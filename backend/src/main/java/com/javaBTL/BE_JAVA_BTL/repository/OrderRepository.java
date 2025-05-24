package com.javaBTL.BE_JAVA_BTL.repository;

import com.javaBTL.BE_JAVA_BTL.model.order.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {
    List<Order> findByUserId(UUID userId);
}