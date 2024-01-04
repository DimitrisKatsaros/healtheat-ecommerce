package com.gmail.katsaros.s.dimitris.ecommerce.dao;

import com.gmail.katsaros.s.dimitris.ecommerce.entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin("http://localhost:4200") // Otherwise Angular won't be able to access the data from Spring Boot. This has to do with javascript scripts that run in a browser
@RepositoryRestResource(collectionResourceRel = "productCategory", path = "product-category")
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {
}
