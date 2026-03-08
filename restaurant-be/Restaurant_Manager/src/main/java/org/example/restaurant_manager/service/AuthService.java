package org.example.restaurant_manager.service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.restaurant_manager.dto.request.LoginRequest;
import org.example.restaurant_manager.dto.request.RegisterRequest;
import org.example.restaurant_manager.dto.response.AuthResponse;
import org.example.restaurant_manager.dto.response.UserResponse;
import org.example.restaurant_manager.entity.User;
import org.example.restaurant_manager.enums.ErrorCode;
import org.example.restaurant_manager.enums.Role;
import org.example.restaurant_manager.exception.AppException;
import org.example.restaurant_manager.mapper.UserMapper;
import org.example.restaurant_manager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Value("${signer_key}")
    private String SIGNER_KEY;



    public UserResponse register(RegisterRequest request)  {
        if(userRepository.existsByName(request.getUsername()) ||  userRepository.existsByEmail(request.getEmail())){
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        User saved = new User();
        saved.setPassword(passwordEncoder.encode(request.getPassword()));
        saved.setEmail(request.getEmail());
        saved.setName(request.getUsername());
        saved.setRole(Role.STAFF);
        return userMapper.toUserResponse(userRepository.save(saved));
    }

    public AuthResponse login(LoginRequest request)  {
        User u = userRepository.findByName(request.getUsername()).orElseThrow(() ->
                new AppException(ErrorCode.USER_NOT_FOUND));
        if (!passwordEncoder.matches(request.getPassword(), u.getPassword())) {
            throw new AppException(ErrorCode.PASSWORD_INVALID);
        }
        var token = generateToken(u);
        return AuthResponse.builder()
                .token(token)
                .build();
    }
    private String generateToken(User user){
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getName())
                .issuer("Toandev")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(24 , ChronoUnit.HOURS).toEpochMilli()
                ))
                .claim("scope" ,user.getRole().toString())
                .build();
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header,payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.warn("Cannot create token" + e.getMessage());
            throw new RuntimeException(e);
        }
    }
}
