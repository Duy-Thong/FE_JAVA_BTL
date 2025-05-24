package com.javaBTL.BE_JAVA_BTL.model.shipment;

public enum ShipmentStatus {
    PENDING,            // Chờ xử lý
    CONFIRMED,          // Đã xác nhận
    PROCESSING,         // Đang xử lý
    SHIPPING,           // Đang giao hàng
    DELIVERED,          // Đã giao hàng
    CANCELLED,          // Đã hủy
    RETURNED            // Đã hoàn trả
}