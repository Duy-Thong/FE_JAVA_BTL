package com.javaBTL.BE_JAVA_BTL.service.ratingDAO;

import com.javaBTL.BE_JAVA_BTL.model.rating.Rating;
import com.javaBTL.BE_JAVA_BTL.model.product.Product;
import com.javaBTL.BE_JAVA_BTL.repository.RatingRepository;
import com.javaBTL.BE_JAVA_BTL.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class RatingServiceImpl implements RatingService {
    @Autowired
    private RatingRepository ratingRepository;
    
    @Autowired
    private ProductRepository productRepository;

    @Override
    public Rating createRating(Rating rating, UUID productId) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        rating.setProduct(product);
        return ratingRepository.save(rating);
    }

    @Override
    public List<Rating> getProductRatings(UUID productId) {
        return ratingRepository.findByProductId(productId);
    }

    @Override
    public double getAverageRating(UUID productId) {
        List<Rating> ratings = getProductRatings(productId);
        if (ratings.isEmpty()) return 0.0;
        return ratings.stream()
                .mapToInt(Rating::getRating)
                .average()
                .orElse(0.0);
    }
}
