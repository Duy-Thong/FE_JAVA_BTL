package com.javaBTL.BE_JAVA_BTL.controller.cartController;
import com.javaBTL.BE_JAVA_BTL.model.cart.Cart;
import com.javaBTL.BE_JAVA_BTL.model.cart.CartItem;
import com.javaBTL.BE_JAVA_BTL.model.product.Product;
import com.javaBTL.BE_JAVA_BTL.service.cartItemDAO.CartItemService;
import com.javaBTL.BE_JAVA_BTL.service.cartDAO.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/cartitems")
public class CartItemController {

    private final CartItemService cartItemService;
    private CartService cartService;
    @Autowired
    public CartItemController(CartItemService cartItemService, CartService cartService) {
        this.cartItemService = cartItemService;
        this.cartService = cartService; // Initialize cartService
    }

    // Thêm sản phẩm vào giỏ hàng
    @PostMapping("/add/{cartId}")
    public ResponseEntity<String> addCartItem(@PathVariable UUID cartId, @RequestBody CartItem cartItemRequest) {


        Product product = cartItemRequest.getProduct();
        int quantity = cartItemRequest.getQuantity();
        // Create a new CartItem and set its cartId
        CartItem cartItem = new CartItem();
        // Assuming that cartService is an instance of CartService
        Cart cart = cartService.findById(cartId);
        cartItem.setCart(cart);
        cartItem.setProduct(product);
        cartItem.setQuantity(quantity);
        cartItem = cartItemService.addToCart(cartId, product, quantity);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("" + cartItem.getProduct().getName() + " added to cart successfully");
    }
    @GetMapping("/{cartId}")
    public List<Product> findById(@PathVariable UUID cartId) {
        return cartItemService.findByCartId(cartId);
    }
    @GetMapping("/count/{cartId}")
    public int countItemByCartId(@PathVariable UUID cartId) {
        return cartItemService.countItemByCartId(cartId);
    }
    @GetMapping("total/{cartId}")
    public long totalPriceByCartId(@PathVariable UUID cartId) {
        return cartItemService.totalPriceByCartId(cartId);
    }
    @DeleteMapping("/delete/{cartId}/{productId}")
    public ResponseEntity<String> deleteCartItem(@PathVariable UUID cartId, @PathVariable UUID productId) {
        cartItemService.deleteByCartIdAndProductId(cartId, productId);
        return ResponseEntity.status(HttpStatus.OK).body("Deleted successfully");
    }

}
