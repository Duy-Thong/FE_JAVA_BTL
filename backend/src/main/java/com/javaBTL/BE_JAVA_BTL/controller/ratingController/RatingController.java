package com.javaBTL.BE_JAVA_BTL.controller.ratingController;

import com.javaBTL.BE_JAVA_BTL.model.rating.Rating;
import com.javaBTL.BE_JAVA_BTL.service.ratingDAO.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {
    @Autowired
    private RatingService ratingService;

    @PostMapping("/product/{productId}")
    public ResponseEntity<Rating> createRating(@RequestBody Rating rating, @PathVariable UUID productId) {
        return ResponseEntity.ok(ratingService.createRating(rating, productId));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Rating>> getProductRatings(@PathVariable UUID productId) {
        return ResponseEntity.ok(ratingService.getProductRatings(productId));
    }

    @GetMapping("/product/{productId}/average")
    public ResponseEntity<Double> getAverageRating(@PathVariable UUID productId) {
        return ResponseEntity.ok(ratingService.getAverageRating(productId));
    }
}
