package com.main.omniplanner.user;


import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordService passwordService;

    @Value("${jwt.secret}")
    public String SECRET_KEY;

    @Value("${jwt.expiration}")
    public Long JWT_EXPIRATION;

    // Constructor injection
    public UserService(UserRepository userRepository, PasswordService passwordService){
        this.userRepository = userRepository;
        this.passwordService = passwordService;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public String checkLogin(String username, String token) {
        List<User> users = userRepository.findByUserName(username);

        if (users.isEmpty()) {
            return null;
        }

        for (User user : users) {
            if (user.getTempToken().equals(token)) {
                return user.toString();
            }
        }

        return null;
    }

    public String checkLogin(String username, String token, String userId) {
        String user = checkLogin(username, token);
        if (user == null) {
            return null;
        }
        String[] userDetails = user.split(",");
        if(userDetails[0].equals(userId)) {
            return user;
        }
        return null;
    }

    public String login(String username, String password) {
        List<User> users = userRepository.findByUserName(username);

        if (users.isEmpty()) {
            System.out.println("No users found with username: " + username);
            User newUser = new User();
            newUser.setUserName(username);
            String token = generateToken(newUser);
            newUser.setTempToken(token);
            registerUser(newUser, password);
            return newUser.toString();
        }

        for (User user : users) {
            if (passwordService.verifyPassword(password, user.getSalt(), user.getPasswordHash())) {
                String token = generateToken(user);
                user.setTempToken(token);
                userRepository.save(user);
                return user.toString();
            }
        }

        System.out.println("No matching password for username: " + username);
        return null;
    }

    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getUserName())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION))
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
                .compact();
    }

    public void registerUser(User user, String password) {
        String salt = passwordService.generateSalt();
        String hashedPassword = passwordService.hashPassword(password, salt);
        user.setSalt(salt);
        user.setPasswordHash(hashedPassword);// Ensure the ID is null for new users
        userRepository.save(user);
    }
}

