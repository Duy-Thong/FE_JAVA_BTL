package com.javaBTL.BE_JAVA_BTL.model.user;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.javaBTL.BE_JAVA_BTL.model.cart.Cart;
import jakarta.persistence.*;

import java.time.LocalDateTime;

import java.util.UUID; // Import the UUID class

@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO) // Use AUTO for UUID generation
    private UUID id; // Change id to UUID
    private String name;
    private String email;
    private String password; // Add password field
    private String role;
    private LocalDateTime createdDate;
    private LocalDateTime lastModifiedDate;
    @OneToOne(mappedBy = "user")
    @JsonBackReference
    private Cart cart;

    public User() {
        this.role = "client"; // Set the default role to "client" in the constructor
        this.createdDate = LocalDateTime.now();
        this.lastModifiedDate = LocalDateTime.now();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public LocalDateTime getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(LocalDateTime lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }
}