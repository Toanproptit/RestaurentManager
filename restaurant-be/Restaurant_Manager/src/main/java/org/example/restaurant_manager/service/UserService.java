package org.example.restaurant_manager.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.restaurant_manager.dto.response.UserResponse;
import org.example.restaurant_manager.entity.User;
import org.example.restaurant_manager.enums.ErrorCode;
import org.example.restaurant_manager.exception.AppException;
import org.example.restaurant_manager.mapper.UserMapper;
import org.example.restaurant_manager.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserResponse create(User user) {
        if(userRepository.existsByName(user.getName()) || userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("User already exists");
        }
        return userMapper.toUserResponse(user);
    }

    public UserResponse findById(Long id){
        return userRepository.findById(id).stream().map(userMapper::toUserResponse).findFirst().orElse(null);
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

}
