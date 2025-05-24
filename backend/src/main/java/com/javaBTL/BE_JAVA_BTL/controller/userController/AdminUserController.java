package com.javaBTL.BE_JAVA_BTL.controller.userController;

import com.javaBTL.BE_JAVA_BTL.model.user.User;
import com.javaBTL.BE_JAVA_BTL.service.userDAO.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {
    @Autowired
    private UserService userService;


    @PostMapping("/add")
    public ResponseEntity<String> add(@RequestBody User user){
        User storedUser = userService.getUserByEmail(user.getEmail());
        if (storedUser == null) {
            User savedUser = userService.saveUser(user);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("User " + savedUser.getId() + " added successfully");
        }
        else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User with this email has been created");
        }
    }

    @GetMapping("/all")
    public List<User> getAllUser() {
        return userService.getAllUser();
    }

    @GetMapping("")
    public ResponseEntity<User> getUserById(@RequestParam("id") UUID userId) {
        try {
            User user = userService.getUserById(userId);

            if (user != null) {
                return ResponseEntity.ok(user);
            } else {
                System.out.println("USER NOT FOUND -> ID: " + userId);
                return ResponseEntity.notFound().build();
            }
        } catch (IllegalArgumentException e) {
            // Handle the case where the provided "id" parameter is not a valid UUID
            System.out.println("INVALID UUID -> " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @CrossOrigin
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteUser(@RequestParam("id") UUID userId) {
        try {
            boolean deleted = userService.deleteUser(userId);

            if (deleted) {
                return ResponseEntity.ok("User" + userId + "deleted successfully");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting user");
        }
    }

    @CrossOrigin
    @PostMapping("/update")
    public ResponseEntity<User> updateUser(@RequestParam("id") UUID userId, @RequestBody User updatedUser) {
        try {
            User updatedUserResult = userService.adminUpdateUser(userId, updatedUser);

            if (updatedUserResult != null) {
                return ResponseEntity.ok(updatedUserResult);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}