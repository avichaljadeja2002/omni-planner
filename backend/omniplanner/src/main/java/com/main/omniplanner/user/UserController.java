package com.main.omniplanner.user;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public List<User> getUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("/login")
    public String login(@RequestBody String loginRequest) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(loginRequest);

            String username = jsonNode.get("userName").asText();
            String password = jsonNode.get("password").asText();

            return userService.login(username, password);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}


