package org.example.restaurant_manager.mapper;

import org.example.restaurant_manager.dto.response.UserResponse;
import org.example.restaurant_manager.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public UserResponse toUserResponse(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(),user.getRole().name());
    }
}
