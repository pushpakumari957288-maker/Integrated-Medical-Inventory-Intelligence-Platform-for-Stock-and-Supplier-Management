package com.medistock.controller;

import com.medistock.entity.StockLog;
import com.medistock.service.StockLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock-logs")
public class StockLogController {

    private final StockLogService stockLogService;

    public StockLogController(StockLogService stockLogService) {
        this.stockLogService = stockLogService;
    }

    // View all stock logs
    @GetMapping
    public ResponseEntity<List<StockLog>> getAllLogs() {
        return ResponseEntity.ok(
                stockLogService.getAllLogs()
        );
    }

    // View stock logs for a specific medicine
    @GetMapping("/medicine/{medicineId}")
    public ResponseEntity<List<StockLog>> getLogsByMedicine(
            @PathVariable Integer medicineId) {

        return ResponseEntity.ok(
                stockLogService.getLogsByMedicine(medicineId)
        );
    }
}