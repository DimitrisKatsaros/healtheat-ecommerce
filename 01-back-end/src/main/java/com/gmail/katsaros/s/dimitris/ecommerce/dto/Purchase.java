package com.gmail.katsaros.s.dimitris.ecommerce.dto;

import com.gmail.katsaros.s.dimitris.ecommerce.entity.Address;
import com.gmail.katsaros.s.dimitris.ecommerce.entity.Customer;
import com.gmail.katsaros.s.dimitris.ecommerce.entity.Order;
import com.gmail.katsaros.s.dimitris.ecommerce.entity.OrderItem;

import java.util.HashSet;
import java.util.Set;

public class Purchase {

    private Customer customer;

    private Address shippingAddress;

    private Address billingAddress;

    private Order order;


    private Set<OrderItem> orderItems = new HashSet<>();
    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Address getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(Address shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public Address getBillingAddress() {
        return billingAddress;
    }

    public void setBillingAddress(Address billingAddress) {
        this.billingAddress = billingAddress;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Set<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(Set<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }
}
