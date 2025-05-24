package com.javaBTL.BE_JAVA_BTL.repository;

import com.javaBTL.BE_JAVA_BTL.model.rating.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, UUID> {
    List<Rating> findByProductId(UUID productId);
}
