package org.example.restaurant_manager.service;


import jakarta.transaction.Transactional;
import org.example.restaurant_manager.dto.response.CustomerResponse;
import org.example.restaurant_manager.mapper.CustomerMapper;
import org.example.restaurant_manager.model.Customer;
import org.example.restaurant_manager.model.Reservation;
import org.example.restaurant_manager.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    public CustomerService(CustomerRepository customerRepository,
                           CustomerMapper customerMapper) {
        this.customerRepository = customerRepository;
        this.customerMapper = customerMapper;
    }

    public List<CustomerResponse> findAll(){
        return customerRepository.findAll()
                .stream()
                .map(customerMapper::toCustomerResponse)
                .toList();
    }

    public CustomerResponse findById(Long id){
        return customerMapper.toCustomerResponse(getEntity(id));
    }

    public CustomerResponse create(Customer customer){

        Set<Reservation> reservations = customer.getReservations();

        customer.setReservations(new HashSet<>());

        if(reservations != null){
            reservations.forEach(customer::addReservation);
        }

        return customerMapper.toCustomerResponse(
                customerRepository.save(customer)
        );
    }

    @Transactional
    public CustomerResponse update(Long id, Customer newCustomer){
        Customer oldCustomer = getEntity(id);

        oldCustomer.setName(newCustomer.getName());
        oldCustomer.setAddress(newCustomer.getAddress());
        oldCustomer.setEmail(newCustomer.getEmail());
        oldCustomer.setPhone(newCustomer.getPhone());

        return customerMapper.toCustomerResponse(oldCustomer);
    }

    public void deleteById(Long id){
        Customer customer = getEntity(id);
        customerRepository.delete(customer);
    }

    private Customer getEntity(Long id){
        return customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }
}