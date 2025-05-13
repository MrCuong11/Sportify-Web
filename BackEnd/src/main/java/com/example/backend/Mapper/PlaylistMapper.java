package com.example.backend.Mapper;

import com.example.backend.DTO.Response.PlaylistResponse;
import com.example.backend.DTO.Response.PlaylistSongResponse;
import com.example.backend.Entity.Playlist;
import com.example.backend.Entity.PlaylistSong;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import com.example.backend.Enums.PlaylistStatus;

@Mapper(componentModel = "spring", imports = PlaylistStatus.class)
public interface PlaylistMapper {

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "playlistSongs", target = "songs")
//    @Mapping(source = "imageUrl", target = "imageUrl")
    @Mapping(target = "archive", expression = "java(playlist.getStatus() == PlaylistStatus.ARCHIVED)")
    PlaylistResponse toResponse(Playlist playlist);

    @Mapping(source = "song.id", target = "songId")
    @Mapping(source = "song.title", target = "title")
    PlaylistSongResponse toPlaylistSongResponse(PlaylistSong playlistSong);
}

