package com.javaBTL.BE_JAVA_BTL.service.cartItemDAO;

import com.javaBTL.BE_JAVA_BTL.model.cart.Cart;
import com.javaBTL.BE_JAVA_BTL.model.cart.CartItem;
import com.javaBTL.BE_JAVA_BTL.model.product.Product;
import com.javaBTL.BE_JAVA_BTL.repository.CartItemRepository;
import com.javaBTL.BE_JAVA_BTL.repository.CartRepository;
import com.javaBTL.BE_JAVA_BTL.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CartItemServiceImpl implements CartItemService {
    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public CartItem addToCart(UUID cartId,Product product, int quantity) {
        CartItem existingCartItem = cartItemRepository.findByCartIdAndProductId(cartId, product.getId());
        if (existingCartItem != null) {
            existingCartItem.setQuantity(existingCartItem.getQuantity() + quantity);
            return cartItemRepository.save(existingCartItem);
        }
        else
        {
            CartItem cartItem = new CartItem();
            Optional<Cart> cart = cartRepository.findById(cartId);
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            cartItem.setCart(cart.get());
            return cartItemRepository.save(cartItem);
        }
    }
    @Override
    public List<Product> findByCartId(UUID cartId) {
        return cartItemRepository.findByCartId(cartId);
    }
    @Override
    public void deleteByCartIdAndProductId(UUID cartId, UUID productId) {
        CartItem cartItemToDelete = cartItemRepository.findByCartIdAndProductId(cartId, productId);
        if (cartItemToDelete != null) {
            UUID Id=cartItemToDelete.getId();
            cartItemRepository.deleteById(Id);
        }
    }
    @Override
    public int countItemByCartId(UUID cartId) {
        List<CartItem> cartItems = cartItemRepository.findByCartId2(cartId);

        int totalQuantity = cartItems.stream().mapToInt(CartItem::getQuantity).sum();

        return totalQuantity;
    }
    @Override
    public long totalPriceByCartId(UUID cartId) {
        List<CartItem> cartItems = cartItemRepository.findByCartId2(cartId);

        long totalPrice = cartItems.stream()
                .mapToLong(cartItem -> cartItem.getProduct().getPrice() * cartItem.getQuantity())
                .sum();

        return totalPrice;
    }



}
