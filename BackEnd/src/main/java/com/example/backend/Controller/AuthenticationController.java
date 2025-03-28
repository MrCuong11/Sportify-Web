package com.example.backend.Controller;

import com.example.backend.DTO.Request.ApiResponse;
import com.example.backend.DTO.Request.AuthenticationRequest;
import com.example.backend.DTO.Response.AuthenticationResponse;
import com.example.backend.Service.AuthenticationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;

    @PostMapping("/token")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request){
        var result = authenticationService.authenticate(request);
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
}
