package com.javaBTL.BE_JAVA_BTL.service.cartDAO;

import com.javaBTL.BE_JAVA_BTL.model.cart.Cart;

import java.util.List;
import java.util.UUID;

public interface CartService {

    Cart findById(UUID cartId);

    List<UUID> getAllCartId();

    void clearCart(UUID cartId);

    Cart getCartByUserId(UUID userId);
}
