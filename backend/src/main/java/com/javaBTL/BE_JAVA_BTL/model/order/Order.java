package com.javaBTL.BE_JAVA_BTL.model.order;

import com.javaBTL.BE_JAVA_BTL.model.shipment.Shipment;
import com.javaBTL.BE_JAVA_BTL.model.user.User;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Data
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @JsonManagedReference
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems;

    @JsonManagedReference
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<Shipment> shipments = new ArrayList<>();

    private Double totalAmount;
    private String shippingAddress;
    private String phoneNumber;
    private String customerName; // Thêm trường này
    private String note; // Thêm trường này
    private String paymentMethod;
    private String cardNumber;
    private String cardHolder;
    private String status = "PENDING";

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}