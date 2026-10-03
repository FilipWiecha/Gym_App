package com.filipwiecha.gym.user.models;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

@Mapper(
    componentModel = "spring", 
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
    unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface UserMapper {
    
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "username", ignore = true)
    void updateUserFromDto(UserUpdateDto dto, @MappingTarget User entity);
}
