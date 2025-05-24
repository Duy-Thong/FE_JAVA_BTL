package com.javaBTL.BE_JAVA_BTL.repository;

import com.javaBTL.BE_JAVA_BTL.model.cart.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CartRepository extends JpaRepository<Cart, UUID> {
    // find cart by id
    @Query("select c from Cart c where c.id = :id")
    Cart findCartById(@Param("id") UUID id);
    @Query("select c.id from Cart c" )
    List<UUID> getAllCartId();
    @Query("select c from Cart c where c.user.id = :userId")
    Cart getCartByUserId(@Param("userId") UUID userId);
}


