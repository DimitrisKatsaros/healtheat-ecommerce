package com.gmail.katsaros.s.dimitris.ecommerce.dao;

import com.gmail.katsaros.s.dimitris.ecommerce.entity.Province;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@CrossOrigin("http://localhost:4200")
@RepositoryRestResource
public interface ProvinceRepository extends JpaRepository<Province, Integer> {

    List<Province> findByCountryCode(@Param("code") String code);
}
