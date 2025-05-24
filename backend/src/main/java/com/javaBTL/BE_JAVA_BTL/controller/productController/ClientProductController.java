package com.javaBTL.BE_JAVA_BTL.controller.productController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.javaBTL.BE_JAVA_BTL.model.product.Product;
import com.javaBTL.BE_JAVA_BTL.service.productDAO.ProductService;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/client/api/product")
public class ClientProductController {

    @Autowired
    private ProductService productService;

    // Get all products
    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    // Get all laptops
    @GetMapping("/laptop")
    public List<Product> getAllLaptops() {
        return productService.getAllLaptops();
    }

    // Get product by ID
    @GetMapping("/{id}")
    public Product getProductById(@PathVariable UUID id) {
        return productService.getProductById(id);
    }
    //Search product by keyword
    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam("keyword") String keyword) {
        return productService.searchProducts(keyword);
    }
    @GetMapping("/category/{category}")
    public List<Product> getProductsByCategory(@PathVariable String category) {
        return productService.getProductsByCategory(category);
    }

}