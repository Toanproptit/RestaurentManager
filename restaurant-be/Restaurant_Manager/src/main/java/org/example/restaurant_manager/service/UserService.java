package org.example.restaurant_manager.service;


import java.util.List;

import org.example.restaurant_manager.dto.request.CreateUserRequest;
import org.example.restaurant_manager.dto.request.UpdateUserRequest;
import org.example.restaurant_manager.dto.response.UserResponse;
import org.example.restaurant_manager.entity.User;
import org.example.restaurant_manager.enums.ErrorCode;
import org.example.restaurant_manager.enums.Role;
import org.example.restaurant_manager.exception.AppException;
import org.example.restaurant_manager.mapper.UserMapper;
import org.example.restaurant_manager.repository.UserRepository;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserResponse create(CreateUserRequest request) {
        if (userRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.USERNAME_EXISTED);
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        if (request.getRole() == null) {
            user.setRole(Role.STAFF);
        } else {
            user.setRole(request.getRole());
        }

        return userMapper.toUserResponse(userRepository.save(user));
    }

    public UserResponse findById(Long id){
        return userMapper.toUserResponse(getUser(id));
    }

    public List<UserResponse> findAll(){
        log.info("Find All Users");
        return userRepository.findAll().stream().map(userMapper::toUserResponse).toList();
    }
    public UserResponse getMe(String nameFromToken) throws AppException {
        User user = userRepository.findByName(nameFromToken)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toUserResponse(user);
    }

    public UserResponse update(Long id, UpdateUserRequest request){
        User oldUser = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (request.getName() != null && !request.getName().isBlank()) {
            if (userRepository.existsByNameAndIdNot(request.getName(), id)) {
                throw new AppException(ErrorCode.USERNAME_EXISTED);
            }
            oldUser.setName(request.getName());
        }

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            if (userRepository.existsByEmailAndIdNot(request.getEmail(), id)) {
                throw new AppException(ErrorCode.EMAIL_EXISTED);
            }
            oldUser.setEmail(request.getEmail());
        }

        if (request.getRole() != null) {
            oldUser.setRole(request.getRole());
        }

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            oldUser.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return userMapper.toUserResponse(userRepository.save(oldUser));
    }

    public void deleteById(Long id){
        getUser(id);
        userRepository.deleteById(id);
    }

    public User getUser(Long id){
        return userRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    public UserResponse getMe() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        String username = authentication.getName();

        User user = userRepository.findByName(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return userMapper.toUserResponse(user);
    }
}
