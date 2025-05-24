package com.javaBTL.BE_JAVA_BTL.model.shipment;

import com.javaBTL.BE_JAVA_BTL.model.order.Order;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Data
public class Shipment {
    @Id
    private UUID id;
    
    private String trackingNumber;
    private String recipientName;
    private String recipientPhone;
    private String shippingAddress;
    private String notes;
    private double shippingFee;
    
    @Enumerated(EnumType.STRING)
    private ShipmentStatus status;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;
    
    public Shipment() {
        this.id = UUID.randomUUID();
        this.createdAt = LocalDateTime.now();
        this.status = ShipmentStatus.PENDING;
    }
}