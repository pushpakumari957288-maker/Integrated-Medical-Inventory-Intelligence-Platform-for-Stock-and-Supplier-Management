package com.medistock;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;

/**
 * Main entry point for MediStock Medical Inventory Management Platform Backend.
 *
 * Note: DataSourceAutoConfiguration and HibernateJpaAutoConfiguration are temporarily excluded
 * so the application can start without a live database connection during initial setup.
 * They will be enabled once MySQL is configured.
 */
@SpringBootApplication(exclude = {
    DataSourceAutoConfiguration.class,
    HibernateJpaAutoConfiguration.class
})
public class MediStockApplication {

    public static void main(String[] args) {
        SpringApplication.run(MediStockApplication.class, args);
    }
}
