package com.javaBTL.BE_JAVA_BTL.service.shipmentDAO;

import com.javaBTL.BE_JAVA_BTL.model.order.OrderItem;
import com.javaBTL.BE_JAVA_BTL.model.shipment.Shipment;
import com.javaBTL.BE_JAVA_BTL.model.shipment.ShipmentStatus;
import java.util.List;
import java.util.UUID;

public interface ShipmentService {
    Shipment createShipment(Shipment shipment);
    Shipment updateShipment(UUID id, Shipment shipment);
    void deleteShipment(UUID id);
    Shipment getShipmentById(UUID id);
    List<Shipment> getShipmentsByOrderId(UUID orderId);
    Shipment updateShipmentStatus(UUID id, ShipmentStatus status);
    List<Shipment> getAllShipments();

    List<OrderItem> getShipmentItems(UUID id);
}