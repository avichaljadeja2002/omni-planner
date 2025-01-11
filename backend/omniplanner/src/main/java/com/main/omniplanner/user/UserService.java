package com.main.omniplanner.user;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordService passwordService;

    // Constructor injection
    public UserService(UserRepository userRepository, PasswordService passwordService){
        this.userRepository = userRepository;
        this.passwordService = passwordService;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public String login(String username, String password) {
        List<User> users = userRepository.findByUserName(username);

        if (users.isEmpty()) {
            System.out.println("No users found with username: " + username);
            User newUser = new User();
            newUser.setUserName(username);
            return registerUser(newUser, password)+"," + username + "," + null + "," + null;
        }

        for (User user : users) {
            if (passwordService.verifyPassword(password, user.getSalt(), user.getPasswordHash())) {
                return user.getId() + "," + user.getUserName() + "," + user.getEmail() + "," + user.getName();
            }
        }

        System.out.println("No matching password for username: " + username);
        return null;
    }

    public Integer registerUser(User user, String password) {
        String salt = passwordService.generateSalt();
        String hashedPassword = passwordService.hashPassword(password, salt);
        user.setSalt(salt);
        user.setPasswordHash(hashedPassword);// Ensure the ID is null for new users
        userRepository.save(user);
        return user.getId();
    }
}

