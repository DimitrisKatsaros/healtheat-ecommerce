package com.gmail.katsaros.s.dimitris.ecommerce.service;

import com.gmail.katsaros.s.dimitris.ecommerce.dto.Purchase;
import com.gmail.katsaros.s.dimitris.ecommerce.dto.PurchaseResponse;

public interface CheckOutService {

    PurchaseResponse placeOrder(Purchase purchase);
}
