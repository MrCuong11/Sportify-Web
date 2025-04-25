package com.example.backend.Mapper;


import com.example.backend.DTO.Request.SongRequest;
import com.example.backend.DTO.Response.SongResponse;
import com.example.backend.DTO.Response.SongSimpleResponse;
import com.example.backend.Entity.*;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface SongMapper {

    @Mapping(target = "artistName", source = "artist.name")
    @Mapping(target = "categoryName", source = "category.name")
    @Mapping(target = "albumName", source = "album.name")
    @Mapping(target = "lyrics", source = "lyricLines")
    SongResponse toResponse(Song song);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "playCount", constant = "0L")
    @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "artist", ignore = true)  // set manually after mapping
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "album", ignore = true)
    @Mapping(target = "lyricLines", ignore = true)
    Song toEntity(SongRequest request);


    @Mapping(target = "artistName", source = "artist.name")
    SongSimpleResponse toSimpleResponse(Song song);


}
