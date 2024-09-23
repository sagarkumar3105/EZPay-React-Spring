package com.ezpay.repository;
import java.util.Optional;

/**
 * @Author Sagar Kumar
 * @Purpose Created to use JPA CRUD feature
 */
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ezpay.entity.LoginData;
@Repository
public interface LoginDataRepository extends JpaRepository<LoginData, String> {
	Optional<LoginData> findByUserId(String userId);
}
