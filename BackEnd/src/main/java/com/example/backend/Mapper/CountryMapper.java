package com.example.backend.Mapper;

import com.example.backend.DTO.Request.CountryCreationRequest;
import com.example.backend.DTO.Response.ArtistListResponse;
import com.example.backend.DTO.Response.CountryResponse;
import com.example.backend.DTO.Response.CountryWithArtistsResponse;
import com.example.backend.Entity.Artist;
import com.example.backend.Entity.Country;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CountryMapper {
    CountryResponse toCountryResponse(Country country);
    Country toCountry(CountryCreationRequest request);

    @Mapping(target = "artists", expression = "java(mapArtists(country.getArtists()))")
    CountryWithArtistsResponse toCountryWithArtistsResponse(Country country);

    default List<ArtistListResponse> mapArtists(List<Artist> artists) {
        if (artists == null) return null;
        return artists.stream()
                .map(artist -> new ArtistListResponse(artist.getId(), artist.getName()))
                .toList();
    }
}
