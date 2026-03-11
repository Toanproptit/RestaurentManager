package org.example.restaurant_manager.service;


import java.util.List;

import org.example.restaurant_manager.dto.request.CreateCustomerRequest;
import org.example.restaurant_manager.dto.request.UpdateCustomerRequest;
import org.example.restaurant_manager.dto.response.CustomerResponse;
import org.example.restaurant_manager.entity.Customer;
import org.example.restaurant_manager.enums.ErrorCode;
import org.example.restaurant_manager.exception.AppException;
import org.example.restaurant_manager.mapper.CustomerMapper;
import org.example.restaurant_manager.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

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

    public CustomerResponse create(CreateCustomerRequest request){
        Customer customer = new Customer();
        customer.setName(request.getName());
        customer.setEmail(request.getEmail());
        customer.setPhone(request.getPhone());
        customer.setAddress(request.getAddress());

        return customerMapper.toCustomerResponse(
                customerRepository.save(customer)
        );
    }

    @Transactional
    public CustomerResponse update(Long id, UpdateCustomerRequest newCustomer){
        Customer oldCustomer = getEntity(id);

        if (newCustomer.getName() != null) {
            oldCustomer.setName(newCustomer.getName());
        }
        if (newCustomer.getAddress() != null) {
            oldCustomer.setAddress(newCustomer.getAddress());
        }
        if (newCustomer.getEmail() != null) {
            oldCustomer.setEmail(newCustomer.getEmail());
        }
        if (newCustomer.getPhone() != null) {
            oldCustomer.setPhone(newCustomer.getPhone());
        }

        return customerMapper.toCustomerResponse(oldCustomer);
    }

    public void deleteById(Long id){
        Customer customer = getEntity(id);
        customerRepository.delete(customer);
    }

    private Customer getEntity(Long id){
        return customerRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CUSTOMER_NOT_FOUND));
    }
}