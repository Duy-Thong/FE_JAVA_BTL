package com.javaBTL.BE_JAVA_BTL.service.cartItemDAO;
import com.javaBTL.BE_JAVA_BTL.model.cart.CartItem;
import com.javaBTL.BE_JAVA_BTL.model.product.Product;

import java.util.List;
import java.util.UUID;

public interface CartItemService {
    CartItem addToCart(UUID cartId,Product product, int quantity);
    List<Product> findByCartId(UUID cartId);

    void deleteByCartIdAndProductId(UUID cartId, UUID productId);

    int countItemByCartId(UUID cartId);

    long totalPriceByCartId(UUID cartId);
}
