package com.example.backend.Controller;

import com.example.backend.DTO.Request.ApiResponse;
import com.example.backend.DTO.Request.AuthenticationRequest;
import com.example.backend.DTO.Request.LogoutRequest;
import com.example.backend.DTO.Request.RefreshRequest;
import com.example.backend.DTO.Response.AuthenticationResponse;
import com.example.backend.Service.AuthenticationService;
import com.example.backend.Service.PasswordService;
import com.nimbusds.jose.JOSEException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;
    PasswordService passwordService;

    @PostMapping("/token")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request){
        var result = authenticationService.authenticate(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .result(result)
                .build();
    }

    @PostMapping("/logout")
    ApiResponse<Void> logout(@RequestBody LogoutRequest request)
            throws ParseException, JOSEException {
        authenticationService.logout(request);
        return ApiResponse.<Void>builder()
                .build();
    }

    @PostMapping("/refresh")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody RefreshRequest request)
            throws ParseException, JOSEException {
        var result = authenticationService.refreshToken(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .result(result)
                .build();
    }

//    @PostMapping("/introspect")
//    ApiResponse<IntrospectResponse> authenticate(@RequestBody IntrospectRequest request)
//            throws ParseException, JOSEException {
//        var result = authenticationService.introspect(request);
//        return ApiResponse.<IntrospectResponse>builder()
//                .result(result)
//                .build();
//    }

    @PostMapping("/forgot-password")
    public ApiResponse<String> forgotPassword(@RequestParam String email) {
        passwordService.sendResetPasswordToken(email);
        return ApiResponse.<String>builder()
                .result("Email has been sent.")
                .build();
    }

    @PostMapping("/reset-password")
    public ApiResponse<?> resetPassword(
            @RequestParam String token,
            @RequestParam String newPassword
    ) {
        passwordService.resetPassword(token, newPassword);
        return ApiResponse.<String>builder()
                .result("Reset password successfully !")
                .build();
    }
}
