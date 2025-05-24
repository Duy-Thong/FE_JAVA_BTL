package com.javaBTL.BE_JAVA_BTL.controller.shipmentController;

import com.javaBTL.BE_JAVA_BTL.model.order.OrderItem;
import com.javaBTL.BE_JAVA_BTL.model.shipment.Shipment;
import com.javaBTL.BE_JAVA_BTL.model.shipment.ShipmentStatus;
import com.javaBTL.BE_JAVA_BTL.service.shipmentDAO.ShipmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;
import java.util.List;

@RestController
@RequestMapping("/api/shipments")
public class ShipmentController {
    private final ShipmentService shipmentService;

    public ShipmentController(ShipmentService shipmentService) {
        this.shipmentService = shipmentService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<Shipment>> getAllShipments() {
        return ResponseEntity.ok(shipmentService.getAllShipments());
    }
    @PostMapping
    public ResponseEntity<Shipment> createShipment(@RequestBody Shipment shipment) {
        try {
            Shipment createdShipment = shipmentService.createShipment(shipment);
            return new ResponseEntity<>(createdShipment, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Shipment> updateShipment(@PathVariable UUID id, @RequestBody Shipment shipment) {
        return ResponseEntity.ok(shipmentService.updateShipment(id, shipment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShipment(@PathVariable UUID id) {
        shipmentService.deleteShipment(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Shipment> getShipment(@PathVariable UUID id) {
        return ResponseEntity.ok(shipmentService.getShipmentById(id));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<Shipment>> getShipmentsByOrder(@PathVariable UUID orderId) {
        return ResponseEntity.ok(shipmentService.getShipmentsByOrderId(orderId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Shipment> updateStatus(@PathVariable UUID id, @RequestBody ShipmentStatus status) {
        return ResponseEntity.ok(shipmentService.updateShipmentStatus(id, status));
    }
    @GetMapping("/{id}/items")
    public ResponseEntity<List<OrderItem>>  getShipmentItems(@PathVariable UUID id) {
        return ResponseEntity.ok(shipmentService.getShipmentItems(id));
    }

@GetMapping("/{shipmentId}/order-id")
public String getOrderIdByShipmentId(@PathVariable UUID shipmentId) {
    Shipment shipment = shipmentService.getShipmentById(shipmentId);
    return shipment.getOrder().getId().toString();

}
}