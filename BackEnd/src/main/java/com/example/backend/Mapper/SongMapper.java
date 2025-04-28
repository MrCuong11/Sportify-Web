package com.example.backend.Mapper;


import com.example.backend.DTO.Request.SongRequest;
import com.example.backend.DTO.Response.SongResponse;
import com.example.backend.DTO.Response.SongSimpleResponse;
import com.example.backend.Entity.*;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface SongMapper {

    @Mapping(target = "artistName", source = "artist.name")
    @Mapping(target = "albumName", source = "album.name")
    @Mapping(target = "lyrics", source = "lyricLines")
    SongResponse toResponse(Song song);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "playCount", constant = "0L")
    @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "artist", ignore = true)
//    @Mapping(target = "imgUrl", source = "imgUrl")
    @Mapping(target = "album", ignore = true)
    @Mapping(target = "lyricLines", ignore = true)
    Song toEntity(SongRequest request);


    @Mapping(target = "artistName", source = "artist.name")
    @Mapping(target = "imgUrl", source = "imgUrl")
    SongSimpleResponse toSimpleResponse(Song song);


}
