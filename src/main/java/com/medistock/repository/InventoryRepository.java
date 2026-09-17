package com.medistock.repository;

import com.medistock.entity.Inventory;
import com.medistock.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InventoryRepository extends JpaRepository<Inventory, Integer> {

    Optional<Inventory> findByMedicine(Medicine medicine);
}