package com.javaBTL.BE_JAVA_BTL.service.discountDAO;

import com.javaBTL.BE_JAVA_BTL.model.discount.Discount;
import com.javaBTL.BE_JAVA_BTL.repository.DiscountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DiscountServiceImpl implements DiscountService {

    @Autowired
    private DiscountRepository discountRepository;

    @Override
    public List<Discount> getAllDiscounts() {
        return discountRepository.findAll();
    }

    @Override
    public List<Discount> getActiveDiscounts() {
        return discountRepository.findActiveDiscounts(LocalDateTime.now());
    }

    @Override
    public Optional<Discount> getDiscountById(UUID id) {
        return discountRepository.findById(id);
    }

    @Override
    public Optional<Discount> getDiscountByCode(String code) {
        return discountRepository.findByCode(code);
    }

    @Override
    public Discount createDiscount(Discount discount) {
        // Set default values if not provided
        if (discount.getCurrentUsage() == null) {
            discount.setCurrentUsage(0);
        }
        if (discount.getId() == null) {
            discount.setId(UUID.randomUUID());
        }
        if (discount.getCreatedAt() == null) {
            discount.setCreatedAt(LocalDateTime.now());
        }
        return discountRepository.save(discount);
    }

    @Override
    public Discount updateDiscount(UUID id, Discount updatedDiscount) {
        Optional<Discount> existingDiscountOpt = discountRepository.findById(id);
        
        if (existingDiscountOpt.isPresent()) {
            Discount existingDiscount = existingDiscountOpt.get();
            
            // Update fields but preserve ID and createdAt
            UUID discountId = existingDiscount.getId();
            LocalDateTime createdAt = existingDiscount.getCreatedAt();
            
            // Update the fields from the updatedDiscount
            existingDiscount.setCode(updatedDiscount.getCode());
            existingDiscount.setName(updatedDiscount.getName());
            existingDiscount.setDescription(updatedDiscount.getDescription());
            existingDiscount.setType(updatedDiscount.getType());
            existingDiscount.setValue(updatedDiscount.getValue());
            existingDiscount.setMaxDiscountAmount(updatedDiscount.getMaxDiscountAmount());
            existingDiscount.setMinOrderAmount(updatedDiscount.getMinOrderAmount());
            existingDiscount.setStartDate(updatedDiscount.getStartDate());
            existingDiscount.setEndDate(updatedDiscount.getEndDate());
            existingDiscount.setIsActive(updatedDiscount.isActive());
            existingDiscount.setMaxUsage(updatedDiscount.getMaxUsage());
            
            // Keep the original values that shouldn't be changed
            existingDiscount.setId(discountId);
            existingDiscount.setCreatedAt(createdAt);
            
            return discountRepository.save(existingDiscount);
        } else {
            throw new RuntimeException("Discount with ID: " + id + " not found");
        }
    }

    @Override
    public void deleteDiscount(UUID id) {
        discountRepository.deleteById(id);
    }

    @Override
    public Optional<Discount> validateDiscount(String code, double orderAmount) {
        Optional<Discount> discountOpt = discountRepository.findByCode(code);
        
        if (discountOpt.isPresent()) {
            Discount discount = discountOpt.get();
            
            // Check if discount is active and valid
            LocalDateTime now = LocalDateTime.now();
            boolean isValid = discount.isActive() && 
                            now.isAfter(discount.getStartDate()) && 
                            now.isBefore(discount.getEndDate()) &&
                            (discount.getMaxUsage() == null || discount.getCurrentUsage() < discount.getMaxUsage());
            
            // Check minimum order amount
            boolean meetsMinOrderAmount = discount.getMinOrderAmount() == null || 
                                        orderAmount >= discount.getMinOrderAmount();
            
            if (isValid && meetsMinOrderAmount) {
                return Optional.of(discount);
            }
        }
        
        return Optional.empty();
    }
} 