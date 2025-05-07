package com.example.backend.Controller;

import com.example.backend.DTO.Request.AddSongToPlaylistRequest;
import com.example.backend.DTO.Request.ApiResponse;
import com.example.backend.DTO.Request.CreatePlaylistRequest;
import com.example.backend.DTO.Response.PlaylistResponse;
import com.example.backend.DTO.Response.PlaylistSongResponse;
import com.example.backend.Service.PlaylistService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @DeleteMapping("/remove-song")
    public ApiResponse<Void> removeSongsFromPlaylist(@RequestBody AddSongToPlaylistRequest request) {
        playlistService.removeSongsFromPlaylist(request);
        return ApiResponse.<Void>builder().message("Songs removed successfully").build();
    }


    @GetMapping
    public ApiResponse<Page<PlaylistResponse>> getAllPlaylists(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<PlaylistResponse> playlists = playlistService.getAllPlaylists(pageable);

        return ApiResponse.<Page<PlaylistResponse>>builder()
                .result(playlists)
                .build();
    }

    @GetMapping("/me")
    public ApiResponse<Page<PlaylistResponse>> getMyPlaylists(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<PlaylistResponse> myPlaylists = playlistService.getMyPlaylists(pageable);

        return ApiResponse.<Page<PlaylistResponse>>builder()
                .result(myPlaylists)
                .build();
    }


    @PutMapping("/{id}/archive")
    public ApiResponse<String> archivePlaylist(@PathVariable String id) {
        playlistService.archivePlaylist(id);
        return ApiResponse.<String>builder()
                .result("Playlist has been archived")
                .build();
    }


}
