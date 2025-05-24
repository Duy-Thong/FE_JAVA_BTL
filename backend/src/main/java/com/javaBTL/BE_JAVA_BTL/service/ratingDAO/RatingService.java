package com.javaBTL.BE_JAVA_BTL.service.ratingDAO;

import com.javaBTL.BE_JAVA_BTL.model.rating.Rating;
import java.util.List;
import java.util.UUID;

public interface RatingService {
    Rating createRating(Rating rating, UUID productId);
    List<Rating> getProductRatings(UUID productId);
    double getAverageRating(UUID productId);
}
