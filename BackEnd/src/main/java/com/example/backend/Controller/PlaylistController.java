package com.example.backend.Controller;

import com.example.backend.DTO.Request.AddSongToPlaylistRequest;
import com.example.backend.DTO.Request.ApiResponse;
import com.example.backend.DTO.Request.CreatePlaylistRequest;
import com.example.backend.DTO.Response.PlaylistResponse;
import com.example.backend.DTO.Response.PlaylistSongResponse;
import com.example.backend.Service.PlaylistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/playlists")
@RequiredArgsConstructor
public class PlaylistController {

    private final PlaylistService playlistService;

    @PostMapping
    public ApiResponse<PlaylistResponse> createPlaylist(@RequestBody CreatePlaylistRequest request) {
        PlaylistResponse playlist = playlistService.createPlaylist(request);

        return ApiResponse.<PlaylistResponse>builder()
                        .result(playlist)
                        .build();
    }

    @PostMapping("/add-songs")
    public ApiResponse<List<PlaylistSongResponse>> addSongsToPlaylist(
            @RequestBody AddSongToPlaylistRequest request) {

        List<PlaylistSongResponse> responses = playlistService.addSongsToPlaylist(request);
        return ApiResponse.<List<PlaylistSongResponse>>builder()
                .result(responses)
                .build();
    }

}
