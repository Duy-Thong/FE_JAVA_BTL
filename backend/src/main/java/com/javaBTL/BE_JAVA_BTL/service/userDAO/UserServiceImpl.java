package com.javaBTL.BE_JAVA_BTL.service.userDAO;

import com.javaBTL.BE_JAVA_BTL.model.cart.Cart;
import com.javaBTL.BE_JAVA_BTL.model.user.User;
import com.javaBTL.BE_JAVA_BTL.repository.CartRepository;
import com.javaBTL.BE_JAVA_BTL.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CartRepository cartRepository;


    @Override
    public User saveUser(User user) {
        userRepository.save(user); // tạm thời lưu user
        Cart cart = new Cart();  // tạo 1 cart mới
        cart.setUser(user);
        user.setCart(cart);
        cartRepository.save(cart);
        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUser() {
        return userRepository.findAll();
    }

    @Override
    public User addNewUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public User getUserById(UUID userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            return userOptional.get();
        } else {
            throw new IllegalArgumentException("User with ID " + userId + " not found");
        }
    }

    @Override
    public User getUserByEmail(String email) {
        User user = userRepository.getUserByEmail(email);

        if (user != null) {
            return user;
        } else {
            // You can return null or throw an exception, depending on your application's requirements.
            // For example, you can create a custom exception class for user not found.
            return null;
        }
    }


    @Override
    public User adminUpdateUser(UUID userId, User updatedUser) {
        try {
            // Find the existing user by ID
            Optional<User> existingUserOptional = userRepository.findById(userId);

            if (existingUserOptional.isPresent()) {
                User existingUser = existingUserOptional.get();

                // Update the existing user with new info
                if (updatedUser.getName() != null) {
                    existingUser.setName(updatedUser.getName());
                }
                if (updatedUser.getPassword() != null) {
                    existingUser.setPassword(updatedUser.getPassword());
                }
                if (updatedUser.getRole() != null) {
                    existingUser.setRole(updatedUser.getRole());
                }
                existingUser.setLastModifiedDate(LocalDateTime.now());

                // Save the updated user back to the repository
                User updatedUserResult = userRepository.save(existingUser);

                // Return the updated user
                return updatedUserResult;
            } else {
                // Throw an exception when the user with the provided ID does not exist
                throw new IllegalArgumentException("User with ID " + userId + " does not exist.");
            }
        } catch (Exception e) {
            // Handle other potential exceptions or log them
            throw new RuntimeException("Error updating user with ID " + userId, e);
        }
    }


    @Override
    public boolean deleteUser(UUID userId) {
        Optional<User> existingUser = userRepository.findById(userId);

        if (existingUser.isPresent()) {
            userRepository.deleteById(userId);
            return true; // Return true to indicate successful deletion
        } else {
            // Handle the case when the user with the provided ID does not exist
            return false; // Return false to indicate that the user was not found
        }
    }

    @Override
    public User updateUserByEmail(String email, User updatedUser) {
        try {
            // Find the existing user by ID
            User existingUser = userRepository.getUserByEmail(email);

            if (existingUser != null) {
                if (updatedUser.getName() != null) {
                    existingUser.setName(updatedUser.getName());
                }
                if (updatedUser.getPassword() != null) {
                    existingUser.setPassword(updatedUser.getPassword());
                }
                if (updatedUser.getRole() != null) {
                    existingUser.setRole(updatedUser.getRole());
                }

                // Save the updated user back to the repository
                User updatedUserResult = userRepository.save(existingUser);

                // Return the updated user
                return updatedUserResult;
            } else {
                // Throw an exception when the user with the provided ID does not exist
                throw new IllegalArgumentException("User with email" + email + " does not exist.");
            }
        } catch (Exception e) {
            // Handle other potential exceptions or log them
            throw new RuntimeException("Error updating user with email" + email, e);
        }
    }

}