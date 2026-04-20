package org.example.userservice.service;

import org.example.userservice.exception.ResourceNotFoundException;
import org.example.userservice.modal.User;
import org.example.userservice.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    public User createUser(User user) {
        if (userRepo.existsById(user.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User profile already exists for id: " + user.getId());
        }
        return userRepo.save(user);
    }

    public User getUserById(Long id) {
        return userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
    }

    public User getUserByEmail(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    public User updateUser(Long id, User updatedUser) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));

        user.setName(updatedUser.getName());
        user.setLocation(updatedUser.getLocation());

        return userRepo.save(user);
    }
}