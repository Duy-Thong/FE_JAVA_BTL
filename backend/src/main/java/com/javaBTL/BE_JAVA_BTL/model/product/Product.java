package com.javaBTL.BE_JAVA_BTL.model.product;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.javaBTL.BE_JAVA_BTL.model.rating.Rating;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.*;
import lombok.Data;
import java.util.*;

@Entity
@Data
public class Product {
    @Id
    private UUID id;
    private String retailer;
    private String img_url;
    private String name;
    private long price;
    private String url;
    private String category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("product")
    private List<Rating> ratings = new ArrayList<>();
    
    private double averageRating;
    private int totalRatings;

    public Product() {
        this.id = UUID.randomUUID();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getRetailer() {
        return retailer;
    }

    public void setRetailer(String retailer) {
        this.retailer = retailer;
    }

    public String getImg_url() {
        return img_url;
    }

    public void setImg_url(String img_url) {
        this.img_url = img_url;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public long getPrice() {
        return price;
    }

    public void setPrice(long price) {
        this.price = price;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public List<Rating> getRatings() {
        return ratings;
    }

    public void setRatings(List<Rating> ratings) {
        this.ratings = ratings;
    }

    public double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(double averageRating) {
        this.averageRating = averageRating;
    }

    public int getTotalRatings() {
        return totalRatings;
    }

    public void setTotalRatings(int totalRatings) {
        this.totalRatings = totalRatings;
    }

    public void addRating(Rating rating) {
        ratings.add(rating);
        rating.setProduct(this);
        updateRatingStats();
    }

    private void updateRatingStats() {
        this.totalRatings = ratings.size();
        this.averageRating = ratings.stream()
            .mapToInt(Rating::getRating)
            .average()
            .orElse(0.0);
    }
}