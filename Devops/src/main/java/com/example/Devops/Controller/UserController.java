package com.example.Devops.Controller;

import com.example.Devops.model.User;
import com.example.Devops.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // Signup endpoint
    @PostMapping("/signup")
    public String signup(@RequestBody User user) {
        boolean emailExists = userRepository.findByEmail(user.getEmail()).isPresent();
        if (emailExists) {
            return "Email already exists!";
        }
        userRepository.save(user);
        return "Signup successful!";
    }

    // Login endpoint
    @PostMapping("/login")
    public String login(@RequestBody User user) {
        Optional<User> foundUser = userRepository.findByUsernameAndPassword(
                user.getUsername(), user.getPassword()
        );
        return foundUser.isPresent() ? "Login successful!" : "Invalid credentials!";
    }
}
