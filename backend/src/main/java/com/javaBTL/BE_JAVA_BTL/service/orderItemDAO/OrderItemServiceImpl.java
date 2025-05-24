package com.javaBTL.BE_JAVA_BTL.service.orderItemDAO;

import com.javaBTL.BE_JAVA_BTL.model.order.OrderItem;
import com.javaBTL.BE_JAVA_BTL.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class OrderItemServiceImpl implements OrderItemService {

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Override
    public OrderItem createOrderItem(OrderItem orderItem) {
        return orderItemRepository.save(orderItem);
    }

    @Override
    public OrderItem getOrderItemById(UUID id) {
        return orderItemRepository.findById(id).orElse(null);
    }

    @Override
    public List<OrderItem> getOrderItemsByOrderId(UUID orderId) {
        return orderItemRepository.findByOrder_Id(orderId);
    }

    @Override
    public OrderItem updateOrderItem(UUID id, OrderItem orderItem) {
        if (orderItemRepository.existsById(id)) {
            orderItem.setId(id);
            return orderItemRepository.save(orderItem);
        }
        return null;
    }

    @Override
    public void deleteOrderItem(UUID id) {
        orderItemRepository.deleteById(id);
    }
}
