package com.medistock.service;

import com.medistock.entity.Supplier;
import com.medistock.repository.SupplierRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    public Supplier addSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    public Supplier getSupplierById(Integer id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));
    }

    public Supplier updateSupplier(Integer id, Supplier supplierDetails) {
        Supplier supplier = getSupplierById(id);
        supplier.setSupplierName(supplierDetails.getSupplierName());
        return supplierRepository.save(supplier);
    }

    public void deleteSupplier(Integer id) {
        Supplier supplier = getSupplierById(id);
        supplierRepository.delete(supplier);
    }
}
