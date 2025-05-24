package com.javaBTL.BE_JAVA_BTL.controller.discountController;

import com.javaBTL.BE_JAVA_BTL.model.discount.Discount;
import com.javaBTL.BE_JAVA_BTL.service.discountDAO.DiscountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/client/discounts")
@CrossOrigin
public class ClientDiscountController {

    @Autowired
    private DiscountService discountService;

    @GetMapping("/active")
    public List<Discount> getActiveDiscounts() {
        return discountService.getActiveDiscounts();
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateDiscount(@RequestParam String code, @RequestParam(required = false, defaultValue = "0") double orderAmount) {
        Optional<Discount> validDiscount = discountService.validateDiscount(code, orderAmount);
        
        if (validDiscount.isPresent()) {
            Discount discount = validDiscount.get();
            return ResponseEntity.ok(discount);
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("valid", false);
            response.put("message", "Mã giảm giá không hợp lệ hoặc đã hết hạn");
            return ResponseEntity.ok(response);
        }
    }
} 