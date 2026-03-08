package org.example.restaurant_manager.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.restaurant_manager.dto.response.ApiResponse;
import org.example.restaurant_manager.dto.response.UserResponse;
import org.example.restaurant_manager.entity.User;
import org.example.restaurant_manager.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    private final UserService userService;


//    @GetMapping("/myProfile")
//    public UserResponse me() {
//        var authentication = SecurityContextHolder.getContext().getAuthentication();
//        log.info("username {}",authentication.getName());
//        authentication.getAuthorities().forEach(authority -> log.info(authority.getAuthority()));
//        String username = authentication.getName();
//        return userService.getMe(username); // subject = sub trong token
//    }

    @PostMapping
    public ApiResponse<UserResponse> createUser(@RequestBody User user){
        return ApiResponse.<UserResponse>builder()
                .code(200)
                .message("Success")
                .result(userService.create(user))
                .build();
    }


    @GetMapping("/{id}")
    public ApiResponse<UserResponse> getUserById(@PathVariable Long id) {
        UserResponse user = userService.findById(id);
        return ApiResponse.<UserResponse>builder()
                .code(200)
                .message("Success")
                .result(user)
                .build();
    }


}
