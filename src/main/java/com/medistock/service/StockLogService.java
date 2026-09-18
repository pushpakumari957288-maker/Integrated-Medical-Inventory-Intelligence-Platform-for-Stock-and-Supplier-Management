package com.medistock.service;

import com.medistock.entity.Medicine;
import com.medistock.entity.StockLog;
import com.medistock.repository.MedicineRepository;
import com.medistock.repository.StockLogRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockLogService {

    private final StockLogRepository stockLogRepository;
    private final MedicineRepository medicineRepository;

    public StockLogService(
            StockLogRepository stockLogRepository,
            MedicineRepository medicineRepository) {
        this.stockLogRepository = stockLogRepository;
        this.medicineRepository = medicineRepository;
    }

    public StockLog createLog(
            Integer medicineId,
            String actionType,
            Integer quantityChanged) {

        Medicine medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Medicine not found with id: " + medicineId));

        StockLog stockLog = new StockLog();
        stockLog.setMedicine(medicine);
        stockLog.setActionType(actionType);
        stockLog.setQuantityChanged(quantityChanged);

        return stockLogRepository.save(stockLog);
    }

    public List<StockLog> getAllLogs() {
        return stockLogRepository.findAll();
    }

    public List<StockLog> getLogsByMedicine(Integer medicineId) {

        if (!medicineRepository.existsById(medicineId)) {
            throw new RuntimeException(
                    "Medicine not found with id: " + medicineId);
        }

        return stockLogRepository.findByMedicineId(medicineId);
    }
}