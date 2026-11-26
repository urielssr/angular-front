package com.ssr.Angular.Back_end.product.repositories;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import com.ssr.Angular.Back_end.product.entities.Product;

@Configuration 
public class DataRestConfig implements RepositoryRestConfigurer {

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        config.exposeIdsFor(Product.class);
        cors.addMapping("/api/**")
            .allowedOrigins("http://localhost:4200", "http://localhost:3000")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
            .allowedHeaders("*")
            .allowCredentials(true);
    }


    
}
