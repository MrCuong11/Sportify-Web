package com.example.backend.Mapper;

import com.example.backend.DTO.Request.UserCreationRequest;
import com.example.backend.DTO.Request.UserUpdateRequest;
import com.example.backend.DTO.Response.UserResponse;
import com.example.backend.Entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserCreationRequest request);

    UserResponse toUserResponse(User user);

    void updateUser(@MappingTarget User user, UserUpdateRequest request);
}