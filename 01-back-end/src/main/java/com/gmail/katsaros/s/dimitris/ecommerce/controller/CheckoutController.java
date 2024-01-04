package com.gmail.katsaros.s.dimitris.ecommerce.controller;

import com.gmail.katsaros.s.dimitris.ecommerce.dto.Purchase;
import com.gmail.katsaros.s.dimitris.ecommerce.dto.PurchaseResponse;
import com.gmail.katsaros.s.dimitris.ecommerce.service.CheckOutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    private CheckOutService checkOutService;

    @Autowired
    public CheckoutController(CheckOutService checkOutService) {
        this.checkOutService = checkOutService;
    }

    @PostMapping("/purchase")
    public PurchaseResponse placeOrder(@RequestBody Purchase purchase){

        PurchaseResponse purchaseResponse = checkOutService.placeOrder(purchase);

        return purchaseResponse;
    }
}
