package com.javaBTL.BE_JAVA_BTL.controller.userController;

import com.javaBTL.BE_JAVA_BTL.model.user.User;
import com.javaBTL.BE_JAVA_BTL.service.authDAO.ClientAuthService;
import com.javaBTL.BE_JAVA_BTL.service.userDAO.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/client/users")
public class ClientUserController {
    @Autowired
    private UserService userService;

    @Autowired
    private ClientAuthService clientAuthService;


    @GetMapping("")
    public ResponseEntity<User> getUserInfo(
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        try {
            String token = clientAuthService.extractTokenFromAuthorizationHeader(authorizationHeader);
            String email = clientAuthService.validateAndExtractEmailFromJwt(token);

            if (email == null) {
                // Token is invalid
                System.out.println("INVALID TOKEN -> " + token);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            User user = userService.getUserByEmail(email);
            if (user != null) {
                // Check if the retrieved user's email matches the email in the token
                if (email.equals(user.getEmail())) {
                    return ResponseEntity.ok(user);
                } else {
                    System.out.println("EMAIL MISMATCH -> Token email: " + email + ", User email: " + user.getEmail());
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
                }
            } else {
                System.out.println("USER NOT FOUND -> Email: " + email);
                return ResponseEntity.notFound().build();
            }
        } catch (IllegalArgumentException e) {
            // Handle the case where the provided "id" parameter is not a valid UUID
            System.out.println("INVALID UUID -> " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }


    @PostMapping("/update")
    public ResponseEntity<User> updateUser(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody User updatedUser
    ) {
        try {
            // Validate the authorization header and extract email from JWT
            String token = clientAuthService.extractTokenFromAuthorizationHeader(authorizationHeader);
            String email = clientAuthService.validateAndExtractEmailFromJwt(token);

            if (email == null) {
                // Token is invalid
                System.out.println("INVALID TOKEN -> " + token);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            // Retrieve the user based on the email from the token
            User user = userService.getUserByEmail(email);
            if (user != null) {
                // Update the user information
                // You may need to implement a method in userService to update the user based on email
                // For example, userService.updateUserByEmail(email, updatedUser);
                // This will update the user's information based on their email
                // Make sure to implement this method accordingly
                User updatedUserResult = userService.updateUserByEmail(email, updatedUser);

                if (updatedUserResult != null) {
                    return ResponseEntity.ok(updatedUserResult);
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
                }
            } else {
                System.out.println("USER NOT FOUND -> Email: " + email);
                return ResponseEntity.notFound().build();
            }
        } catch (IllegalArgumentException e) {
            // Handle the case where the provided "id" parameter is not a valid UUID
            System.out.println("INVALID UUID -> " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        User user = userService.getUserByEmail(email);

        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            System.out.println("USER NOT FOUND -> Email: " + email);
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable UUID id) {
        try {
            User user = userService.getUserById(id);

            if (user != null) {
                return ResponseEntity.ok(user);
            } else {
                System.out.println("USER NOT FOUND -> ID: " + id);
                return ResponseEntity.notFound().build();
            }
        } catch (IllegalArgumentException e) {
            // Handle the case where the provided "id" parameter is not a valid UUID
            System.out.println("INVALID UUID -> " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}