package com.example.backend.Mapper;

import com.example.backend.DTO.Request.ArtistCreationRequest;
import com.example.backend.DTO.Response.AlbumBriefResponse;
import com.example.backend.DTO.Response.ArtistDetailResponse;
import com.example.backend.DTO.Response.ArtistResponse;
import com.example.backend.DTO.Response.SongBriefResponse;
import com.example.backend.Entity.Album;
import com.example.backend.Entity.Artist;
import com.example.backend.Entity.Country;
import com.example.backend.Entity.Song;
import org.mapstruct.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface ArtistMapper {

    @Mapping(source = "country.name", target = "countryName")
    ArtistResponse toArtistResponse(Artist artist);

    // mapping thủ công vì country lấy từ service
    Artist toArtist(ArtistCreationRequest request, @Context Country country);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateArtist(@MappingTarget Artist artist, ArtistCreationRequest request, @Context Country country);


}

