package com.medistock.controller;

import com.medistock.entity.Inventory;
import com.medistock.service.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    // Add stock
    @PostMapping
    public ResponseEntity<Inventory> addStock(
            @RequestParam Integer medicineId,
            @RequestParam Integer quantity) {

        return ResponseEntity.ok(
                inventoryService.addStock(medicineId, quantity)
        );
    }

    // Update stock
    @PutMapping("/{medicineId}")
    public ResponseEntity<Inventory> updateStock(
            @PathVariable Integer medicineId,
            @RequestParam Integer quantity) {

        return ResponseEntity.ok(
                inventoryService.updateStock(medicineId, quantity)
        );
    }

    // View all inventory
    @GetMapping
    public ResponseEntity<List<Inventory>> getAllInventory() {
        return ResponseEntity.ok(
                inventoryService.getAllInventory()
        );
    }

    // View inventory for one medicine
    @GetMapping("/{medicineId}")
    public ResponseEntity<Inventory> getInventoryByMedicineId(
            @PathVariable Integer medicineId) {

        return ResponseEntity.ok(
                inventoryService.getInventoryByMedicineId(medicineId)
        );
    }
}