package com.javaBTL.BE_JAVA_BTL.service.userDAO;

import com.javaBTL.BE_JAVA_BTL.model.user.User;

import java.util.List;
import java.util.UUID;

public interface UserService {
    User saveUser(User user);

    //  ADMIN
    List<User> getAllUser();

    User addNewUser(User user);

    User getUserById(UUID userId);
    User getUserByEmail(String email);
    User adminUpdateUser(UUID userId, User user);
    boolean deleteUser(UUID userId);

    //  CLIENT
    User updateUserByEmail(String email, User updatedUser);
}