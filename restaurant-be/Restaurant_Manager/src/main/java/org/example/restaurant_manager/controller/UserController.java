package org.example.restaurant_manager.controller;

import org.example.restaurant_manager.dto.request.CreateUserRequest;
import org.example.restaurant_manager.dto.request.UpdateUserRequest;
import org.example.restaurant_manager.dto.response.ApiResponse;
import org.example.restaurant_manager.dto.response.PageResponse;
import org.example.restaurant_manager.dto.response.UserResponse;
import org.example.restaurant_manager.service.UserService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    private final UserService userService;

    @GetMapping
    public ApiResponse<PageResponse<UserResponse>> getUsers(
            @RequestParam(
                       defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.<PageResponse<UserResponse>>builder()
                .code(200)
                .message("Success")
                .result(userService.findAll(page, size))
                .build();
    }


    @PostMapping
    public ApiResponse<UserResponse> createUser(@RequestBody @Valid CreateUserRequest user){
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

    @GetMapping("/me")
    public ApiResponse<UserResponse> getCurrentUser(){
        return ApiResponse.<UserResponse>builder()
                .code(200)
                .message("Success")
                .result(userService.getMe())
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<UserResponse> updateUser(@PathVariable Long id, @RequestBody @Valid UpdateUserRequest user){
        return ApiResponse.<UserResponse>builder()
                .code(200)
                .message("Success")
                .result(userService.update(id,user))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void>  deleteUser(@PathVariable Long id){
        userService.deleteById(id);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("Success")
                .build();
    }

}
