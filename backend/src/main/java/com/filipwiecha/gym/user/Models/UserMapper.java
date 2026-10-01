package com.filipwiecha.gym.user.Models;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
    componentModel = "spring", 
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface UserMapper {
    
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "username", ignore = true) 
    void updateUserFromDto(UserUpdateDto dto, @MappingTarget User entity);
}
