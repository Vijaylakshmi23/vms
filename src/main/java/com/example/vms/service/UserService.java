package com.example.vms.service;

import java.util.List;

import com.example.vms.entity.User;

public interface UserService {

    User createUser(User user);

    List<User> getAllUsers();

    User getUserById(Long id);

    User updateUser(Long id, User user);

    void deleteUser(Long id);
}
