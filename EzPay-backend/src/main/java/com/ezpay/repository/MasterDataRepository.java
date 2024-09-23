package com.ezpay.repository;

/**
 * @Author Sagar Kumar
 * @Purpose Created to use JPA CRUD feature
 */

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ezpay.entity.Customer;

@Repository
public interface MasterDataRepository extends JpaRepository<Customer, Long> {

}
