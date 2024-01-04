package com.gmail.katsaros.s.dimitris.ecommerce.dao;


import com.gmail.katsaros.s.dimitris.ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestParam;

@CrossOrigin(origins = "http://localhost:4200") // Otherwise Angular won't be able to access the data from Spring Boot. This has to do with javascript scripts that run in a browser
public interface ProductRepository extends JpaRepository<Product,Long> {

    // This is equal to SELECT * FROM product WHERE category_id = ?
    Page<Product> findByCategoryId(@Param("id") Long id, Pageable pageable);

    Page<Product> findByNameContaining(@Param("name") String name, Pageable pageable);
}
