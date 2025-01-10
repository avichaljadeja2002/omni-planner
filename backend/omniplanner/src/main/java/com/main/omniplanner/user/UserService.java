package com.main.omniplanner.user;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Constructor injection
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public String login(String username, String password) {
        List<User> users = userRepository.findByUserName(username);
        if (users.isEmpty()) {
            System.out.println("No users found with username: " + username);
            return null;
        }

        for (User user : users) {
            if (user.getPassword().equals(password)) {
                return user.getId() + "," + user.getUserName() + "," + user.getEmail() + "," + user.getName();
            }
        }

        System.out.println("No matching password for username: " + username);
        return null;
    }
}

