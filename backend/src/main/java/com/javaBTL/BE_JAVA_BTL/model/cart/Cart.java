package com.javaBTL.BE_JAVA_BTL.model.cart;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.javaBTL.BE_JAVA_BTL.model.user.User;
import jakarta.persistence.*;

import java.util.List;
import java.util.UUID;

@Entity
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @OneToOne
    @JsonManagedReference
    private User user;

    @JsonIgnore
    @OneToMany(mappedBy = "cart")
    private List<CartItem> cartItems;

    public Cart(UUID id) {
        this.id = id;
    }
    public Cart() {
        this.id = UUID.randomUUID();
    }
    public Cart(User user) {
        this.id = UUID.randomUUID();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<CartItem> getCartItems() {
        return cartItems;
    }

    public void setCartItems(List<CartItem> cartItems) {
        this.cartItems = cartItems;
    }


}
