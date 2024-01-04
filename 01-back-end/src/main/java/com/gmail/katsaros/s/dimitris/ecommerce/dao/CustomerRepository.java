package com.gmail.katsaros.s.dimitris.ecommerce.dao;

import com.gmail.katsaros.s.dimitris.ecommerce.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}
