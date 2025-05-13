package com.example.backend.Service;

import com.example.backend.DTO.Request.AlbumRequest;
import com.example.backend.DTO.Response.AlbumBriefResponse;
import com.example.backend.DTO.Response.AlbumResponse;
import com.example.backend.Entity.Album;
import com.example.backend.Entity.Artist;
import com.example.backend.Entity.Song;
import com.example.backend.Enums.AlbumStatus;
import com.example.backend.Mapper.AlbumMapper;
import com.example.backend.Repository.AlbumRepository;
import com.example.backend.Repository.ArtistRepository;
import com.example.backend.Repository.SongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlbumService {

    private final AlbumRepository albumRepository;
    private final ArtistRepository artistRepository;
    private final SongRepository songRepository;
    private final AlbumMapper albumMapper;

    public AlbumResponse createAlbum(AlbumRequest dto) {
        Artist artist = artistRepository.findById(dto.getArtistId())
                .orElseThrow(() -> new RuntimeException("Artist not found"));

        List<Song> songs = songRepository.findAllById(dto.getSongIds());

        Album album = albumMapper.toEntity(dto, artist, songs);
        album = albumRepository.save(album);

        return albumMapper.toAlbumResponse(album);
    }

    public AlbumResponse getAlbum(String id) {
        Album album = albumRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Album not found"));

        return albumMapper.toAlbumResponse(album);
    }

    public Page<AlbumBriefResponse> getAllAlbums(Pageable pageable) {
        return albumRepository.findAll(pageable)
                .map(albumMapper::toAlbumBrief);
    }

    public AlbumResponse updateAlbum(String id, AlbumRequest dto) {
        Album existing = albumRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Album not found"));

        Artist artist = artistRepository.findById(dto.getArtistId())
                .orElseThrow(() -> new RuntimeException("Artist not found"));

        List<Song> songs = songRepository.findAllById(dto.getSongIds());

        existing.setName(dto.getName());
        existing.setCoverImageUrl(dto.getCoverImageUrl());
        existing.setReleaseDate(dto.getReleaseDate());
        existing.setArtist(artist);
        existing.setSongs(songs);

        return albumMapper.toAlbumResponse(albumRepository.save(existing));
    }

//    public void deleteAlbum(String id) {
//        if (!albumRepository.existsById(id)) {
//            throw new RuntimeException("Album not found");
//        }
//        albumRepository.deleteById(id);
//    }

    public void archiveAlbum(String id) {
        Album album = albumRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Album not found"));

        // Cập nhật trạng thái album thành ARCHIVED
        album.setStatus(AlbumStatus.ARCHIVED);

        albumRepository.save(album);  // Lưu album đã cập nhật
    }

    public List<AlbumBriefResponse> getNewAlbumReleases() {
        return albumRepository.findTop10ByOrderByReleaseDateDesc()
                .stream()
                .map(album -> AlbumBriefResponse.builder()
                        .id(album.getId())
                        .name(album.getName())
                        .coverImageUrl(album.getCoverImageUrl())
                        .releaseDate(album.getReleaseDate())
                        .build())
                .collect(Collectors.toList());
    }

}
