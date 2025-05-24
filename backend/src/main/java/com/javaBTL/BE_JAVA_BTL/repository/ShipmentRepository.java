package com.javaBTL.BE_JAVA_BTL.repository;

import com.javaBTL.BE_JAVA_BTL.model.shipment.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.List;

public interface ShipmentRepository extends JpaRepository<Shipment, UUID> {
    List<Shipment> findByOrderId(UUID orderId);
    Shipment findByTrackingNumber(String trackingNumber);
}