package com.javaBTL.BE_JAVA_BTL.controller.cartController;

import com.javaBTL.BE_JAVA_BTL.model.cart.Cart;
import com.javaBTL.BE_JAVA_BTL.service.cartItemDAO.CartItemService;
import com.javaBTL.BE_JAVA_BTL.service.cartDAO.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    @Autowired
    private CartService cartService;
    @Autowired
    private CartItemService cartItemService;

    @GetMapping("/all")
    public List<UUID> getAllCart() {
        return cartService.getAllCartId();
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<Cart> getCartByUserId(@PathVariable UUID userId) {
        Cart cart = cartService.getCartByUserId(userId);
        if (cart == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(cart, HttpStatus.OK);
    }

    @DeleteMapping("/{cartId}/clear")
    public void clearCart(@PathVariable UUID cartId) {
        cartService.clearCart(cartId);
    }
}