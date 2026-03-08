package org.example.restaurant_manager.exception;

import lombok.Getter;
import lombok.Setter;
import org.example.restaurant_manager.enums.ErrorCode;

@Getter
@Setter
public class AppException extends RuntimeException  {
    private ErrorCode errorCode;
    public AppException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}
