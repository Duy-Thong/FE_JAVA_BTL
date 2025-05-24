package com.javaBTL.BE_JAVA_BTL.service.discountDAO;

import com.javaBTL.BE_JAVA_BTL.model.discount.Discount;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DiscountService {
    List<Discount> getAllDiscounts();
    List<Discount> getActiveDiscounts();
    Optional<Discount> getDiscountById(UUID id);
    Optional<Discount> getDiscountByCode(String code);
    Discount createDiscount(Discount discount);
    Discount updateDiscount(UUID id, Discount updatedDiscount);
    void deleteDiscount(UUID id);
    Optional<Discount> validateDiscount(String code, double orderAmount);
} 