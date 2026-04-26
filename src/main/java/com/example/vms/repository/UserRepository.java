package com.example.vms.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.vms.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}
