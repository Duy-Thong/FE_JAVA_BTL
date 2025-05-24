package com.javaBTL.BE_JAVA_BTL.service.cartDAO;
import com.javaBTL.BE_JAVA_BTL.repository.CartItemRepository;

import com.javaBTL.BE_JAVA_BTL.repository.CartRepository;
import com.javaBTL.BE_JAVA_BTL.model.cart.Cart;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CartServiceImpl implements CartService {
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private CartItemRepository cartItemRepository;
    @Override
    public List<UUID> getAllCartId() {
        return cartRepository.getAllCartId();
    }
    @Override
    public Cart findById(UUID cartId) {
        return cartRepository.findById(cartId).orElse(null);
    }
    @Override
    public void clearCart(UUID cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        cartItemRepository.deleteByCartId(cartId);
    }
    @Override
    public Cart getCartByUserId(UUID userId) {
        return cartRepository.getCartByUserId(userId);
    }


}
