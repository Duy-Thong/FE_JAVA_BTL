package com.javaBTL.BE_JAVA_BTL.model.cart;

import com.javaBTL.BE_JAVA_BTL.model.product.Product;
import jakarta.persistence.*;

import java.io.Serializable;
import java.util.UUID;

@Entity
public class CartItem implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    private Product product;

    @ManyToOne
    private Cart cart;
    private int quantity;

    public CartItem() {
        // Tạo một UUID mới khi tạo đối tượng CartItem
        this.id = UUID.randomUUID();
    }

    public CartItem(Product product, int quantity) {
        this.id = UUID.randomUUID();
        this.product = product;
        this.quantity = quantity;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }


    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}