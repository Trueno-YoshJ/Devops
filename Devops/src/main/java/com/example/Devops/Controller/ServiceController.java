package com.example.Devops.Controller;

import com.example.Devops.model.ServiceEntity;
import com.example.Devops.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*")
public class ServiceController {

    @Autowired
    private ServiceRepository serviceRepository;

    // CREATE
    @PostMapping
    public ServiceEntity createService(@RequestBody ServiceEntity service) {
        return serviceRepository.save(service);
    }

    // READ ALL
    @GetMapping
    public List<ServiceEntity> getAllServices() {
        return serviceRepository.findAll();
    }

    // READ ONE
    @GetMapping("/{id}")
    public ServiceEntity getServiceById(@PathVariable Long id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));
    }

    // UPDATE
    @PutMapping("/{id}")
    public ServiceEntity updateService(@PathVariable Long id, @RequestBody ServiceEntity updatedService) {
        ServiceEntity service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        service.setServiceName(updatedService.getServiceName());
        service.setVehiclePlate(updatedService.getVehiclePlate());
        service.setOwnerName(updatedService.getOwnerName());
        service.setServiceDate(updatedService.getServiceDate());
        service.setServiceTime(updatedService.getServiceTime());
        service.setPrice(updatedService.getPrice());

        return serviceRepository.save(service);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void deleteService(@PathVariable Long id) {
        serviceRepository.deleteById(id);
    }
}
