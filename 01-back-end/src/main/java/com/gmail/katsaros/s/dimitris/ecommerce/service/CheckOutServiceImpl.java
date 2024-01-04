package com.gmail.katsaros.s.dimitris.ecommerce.service;

import com.gmail.katsaros.s.dimitris.ecommerce.dao.CustomerRepository;
import com.gmail.katsaros.s.dimitris.ecommerce.dto.Purchase;
import com.gmail.katsaros.s.dimitris.ecommerce.dto.PurchaseResponse;
import com.gmail.katsaros.s.dimitris.ecommerce.entity.Customer;
import com.gmail.katsaros.s.dimitris.ecommerce.entity.Order;
import com.gmail.katsaros.s.dimitris.ecommerce.entity.OrderItem;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;

@Service
public class CheckOutServiceImpl implements CheckOutService {

    private CustomerRepository customerRepository;

    @Autowired
    public CheckOutServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {

        // Retrieve order info from dto
        Order order = purchase.getOrder();

        // Generate tracking number
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        // Populate order with orderItems
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.add(item));

        // Populate order with billingAddress and shippingAddress
        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());

        // Populate customer with order
        Customer customer = purchase.getCustomer();
        customer.add(order);

        // Save to the database
        customerRepository.save(customer);

        // return a response
        return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTrackingNumber() {

        // Generate a random UUID number (UUID version-4) ... Universal Unique Identifier
        return UUID.randomUUID().toString();
    }
}
