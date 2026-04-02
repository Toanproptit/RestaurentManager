package org.example.restaurant_manager.config;

import java.util.List;

import org.example.restaurant_manager.enums.Role;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    private static final String[] PUBLIC_ENDPOINTS = {
            "/auth/**",
            "/error",
            "/uploads/**"
    };

    private static final String[] ADMIN_ONLY_ENDPOINTS = {
                    "/users",
                    "/users/**",
                    "/invoices/revenue/**"
    };

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOriginPatterns(List.of(
            "http://localhost:*",
            "http://127.0.0.1:*"
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http , JwtDecode jwtDecode) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(PUBLIC_ENDPOINTS).permitAll()
                        .requestMatchers("/users/me").authenticated()
                        .requestMatchers(ADMIN_ONLY_ENDPOINTS).hasRole(Role.ADMIN.name())
                        .requestMatchers(HttpMethod.POST, "/foods").hasRole(Role.ADMIN.name())
                        .requestMatchers(HttpMethod.PUT, "/foods/**").hasRole(Role.ADMIN.name())
                        .requestMatchers(HttpMethod.DELETE, "/foods/**").hasRole(Role.ADMIN.name())
                        .requestMatchers(HttpMethod.POST , "/dining-tables/**").hasRole(Role.ADMIN.name())
                        .anyRequest().authenticated()
                );
        JwtGrantedAuthoritiesConverter gac = new JwtGrantedAuthoritiesConverter();
        gac.setAuthorityPrefix("ROLE_");
        gac.setAuthoritiesClaimName("scope");

        JwtAuthenticationConverter jca = new JwtAuthenticationConverter();
        jca.setJwtGrantedAuthoritiesConverter(gac);

        http.oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt ->
                jwt.decoder(jwtDecode).jwtAuthenticationConverter(jca)));

        return http.build();
    }
}