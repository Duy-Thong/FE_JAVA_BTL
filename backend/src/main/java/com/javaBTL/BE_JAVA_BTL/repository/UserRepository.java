package com.javaBTL.BE_JAVA_BTL.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.javaBTL.BE_JAVA_BTL.model.user.User;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    User getUserByEmail(String email);
}
