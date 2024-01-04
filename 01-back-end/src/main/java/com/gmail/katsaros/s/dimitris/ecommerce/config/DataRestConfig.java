package com.gmail.katsaros.s.dimitris.ecommerce.config;

import com.gmail.katsaros.s.dimitris.ecommerce.entity.Country;
import com.gmail.katsaros.s.dimitris.ecommerce.entity.Product;
import com.gmail.katsaros.s.dimitris.ecommerce.entity.ProductCategory;
import com.gmail.katsaros.s.dimitris.ecommerce.entity.Province;
import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class DataRestConfig implements RepositoryRestConfigurer {

    private EntityManager entityManager;

    @Autowired
    public DataRestConfig(EntityManager entityManager){
        this.entityManager = entityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {

        HttpMethod[] unsupportedActions = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE};

        disableHttpMethods(Product.class, config, unsupportedActions);
        disableHttpMethods(ProductCategory.class, config, unsupportedActions);
        disableHttpMethods(Country.class, config, unsupportedActions);
        disableHttpMethods(Province.class, config, unsupportedActions);

        // Call internal helper method for exposing the IDs.
        exposeIds(config);
    }

    private void disableHttpMethods(Class theClass, RepositoryRestConfiguration config, HttpMethod[] unsupportedActions) {

        // Disable HTTP methods for theClass: "unsupportedActions"
        config.getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure(((metadata, httpMethods) -> httpMethods.disable(unsupportedActions)))
                .withCollectionExposure(((metadata, httpMethods) -> httpMethods.disable(unsupportedActions)));
    }

    // Expose entity ids
    private void exposeIds(RepositoryRestConfiguration config) {

        // Get list of all entity classes from entity manager
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        // Create an array list of those entity types
        List<Class> entityClasses = new ArrayList<>();

        // Get entity types for the entities
        for(EntityType entityType: entities){
            entityClasses.add(entityType.getJavaType());
        }

        // Expose entity ids for the array entity/domain types
        Class[] domainTypes = entityClasses.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);
    }
}
