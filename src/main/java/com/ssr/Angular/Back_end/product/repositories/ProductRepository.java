package com.ssr.Angular.Back_end.product.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.ssr.Angular.Back_end.product.entities.Product;

@RepositoryRestResource (path="products")
public interface ProductRepository extends CrudRepository<Product, Long>{
}
