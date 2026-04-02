package org.example.restaurant_manager.exception;

import org.example.restaurant_manager.dto.response.ApiResponse;
import org.example.restaurant_manager.enums.ErrorCode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiResponse<Void>> handleAppException(AppException exception) {
        ErrorCode errorCode = exception.getErrorCode();
        return ResponseEntity.status(errorCode.getStatusCode())
                .body(ApiResponse.<Void>builder()
                        .code(errorCode.getCode())
                        .message(errorCode.getMessage())
                        .build());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(error -> error.getDefaultMessage())
                .orElse(ErrorCode.INVALID_KEY.getMessage());

        return ResponseEntity.badRequest()
                .body(ApiResponse.<Void>builder()
                        .code(ErrorCode.INVALID_KEY.getCode())
                        .message(message)
                        .build());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDeniedException(AccessDeniedException exception) {
        return ResponseEntity.status(ErrorCode.UNAUTHORIZED.getStatusCode())
                .body(ApiResponse.<Void>builder()
                        .code(ErrorCode.UNAUTHORIZED.getCode())
                        .message(ErrorCode.UNAUTHORIZED.getMessage())
                        .build());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDataIntegrityViolationException(DataIntegrityViolationException exception) {
                Throwable mostSpecificCause = exception.getMostSpecificCause();
                String rootMessage = mostSpecificCause != null ? mostSpecificCause.getMessage() : null;

        String message = ErrorCode.DATA_INTEGRITY_VIOLATION.getMessage();
        if (rootMessage != null && rootMessage.contains("Data truncated for column 'status'")) {
            message = "Database schema mismatch for reservation status. Please update DB enum to include CHECKED_IN.";
        }

        return ResponseEntity.status(ErrorCode.DATA_INTEGRITY_VIOLATION.getStatusCode())
                .body(ApiResponse.<Void>builder()
                        .code(ErrorCode.DATA_INTEGRITY_VIOLATION.getCode())
                        .message(message)
                        .build());
    }
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleException(Exception exception) {
        log.error("Unhandled exception occurred", exception);

        return ResponseEntity.internalServerError()
                .body(ApiResponse.<Void>builder()
                        .code(9999)
                        .message(exception.getMessage())
                        .build());
    }
}