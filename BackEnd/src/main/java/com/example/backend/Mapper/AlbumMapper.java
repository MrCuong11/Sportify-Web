package com.example.backend.Mapper;

import com.example.backend.DTO.Request.AlbumRequest;
import com.example.backend.DTO.Response.AlbumBriefResponse;
import com.example.backend.DTO.Response.AlbumResponse;
import com.example.backend.DTO.Response.ArtistListResponse;
import com.example.backend.DTO.Response.SongBriefResponse;
import com.example.backend.Entity.Album;
import com.example.backend.Entity.Artist;
import com.example.backend.Entity.Song;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AlbumMapper {

    public Album toEntity(AlbumRequest dto, Artist artist, List<Song> songs) {
        return Album.builder()
                .name(dto.getName())
                .coverImageUrl(dto.getCoverImageUrl())
                .releaseDate(dto.getReleaseDate())
                .artist(artist)
                .songs(songs)
                .build();
    }

    public AlbumResponse toAlbumResponse(Album album) {
        AlbumResponse response = new AlbumResponse();
        response.setId(album.getId());
        response.setName(album.getName());
        response.setCoverImageUrl(album.getCoverImageUrl());
        response.setReleaseDate(album.getReleaseDate());

        // Artist
        Artist artist = album.getArtist();
        ArtistListResponse artistResponse = new ArtistListResponse();
        artistResponse.setId(artist.getId());
        artistResponse.setName(artist.getName());
        response.setArtist(artistResponse);

        // Songs
        List<SongBriefResponse> songBriefs = album.getSongs().stream().map(song -> {
            SongBriefResponse s = new SongBriefResponse();
            s.setId(song.getId());
            s.setTitle(song.getTitle());
            s.setDuration(song.getDuration());
            return s;
        }).toList();

        response.setSongs(songBriefs);

        return response;
    }

    public AlbumBriefResponse toAlbumBrief(Album album) {
        return AlbumBriefResponse.builder()
                .id(album.getId())
                .name(album.getName())
                .coverImageUrl(album.getCoverImageUrl())
                .releaseDate(album.getReleaseDate())
                .build();
    }
}
