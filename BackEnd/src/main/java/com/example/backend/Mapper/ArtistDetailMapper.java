package com.example.backend.Mapper;

import com.example.backend.DTO.Response.AlbumBriefResponse;
import com.example.backend.DTO.Response.ArtistDetailResponse;
import com.example.backend.DTO.Response.SongBriefResponse;
import com.example.backend.Entity.Album;
import com.example.backend.Entity.Artist;
import com.example.backend.Entity.Country;
import com.example.backend.Entity.Song;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring") // Sử dụng Spring component model
public interface ArtistDetailMapper {

    /**
     * Chuyển đổi Artist entity sang ArtistDetailResponse DTO.
     * @param artist Artist entity nguồn
     * @return ArtistDetailResponse DTO
     */
    @Mapping(source = "country", target = "countryName", qualifiedByName = "countryToName")
    @Mapping(source = "albums", target = "albums", qualifiedByName = "albumsToBriefResponses")
    @Mapping(source = "songs", target = "songs", qualifiedByName = "songsToBriefResponses")
    ArtistDetailResponse toArtistDetailResponse(Artist artist);

    // --- Các phương thức ánh xạ phụ trợ (helper methods) ---
    // Các phương thức này là cần thiết cho toArtistDetailResponse và được giữ lại ở đây.

    /**
     * Lấy tên từ Country object, xử lý trường hợp null.
     * @param country Country entity
     * @return Tên quốc gia hoặc null nếu country là null
     */
    @Named("countryToName")
    default String countryToName(Country country) {
        return (country != null) ? country.getName() : null;
    }

    /**
     * Chuyển đổi danh sách Album entities sang danh sách AlbumBriefResponse DTOs.
     * Xử lý trường hợp danh sách nguồn là null.
     * @param albums Danh sách Album entities
     * @return Danh sách AlbumBriefResponse DTOs hoặc danh sách rỗng
     */
    @Named("albumsToBriefResponses")
    default List<AlbumBriefResponse> albumsToBriefResponses(List<Album> albums) {
        if (albums == null) {
            return Collections.emptyList();
        }
        // Quan trọng: Gọi phương thức albumToAlbumBriefResponse trong *cùng* interface này
        return albums.stream()
                .map(this::albumToAlbumBriefResponse)
                .collect(Collectors.toList());
    }

    /**
     * Chuyển đổi danh sách Song entities sang danh sách SongBriefResponse DTOs.
     * Xử lý trường hợp danh sách nguồn là null.
     * @param songs Danh sách Song entities
     * @return Danh sách SongBriefResponse DTOs hoặc danh sách rỗng
     */
    @Named("songsToBriefResponses")
    default List<SongBriefResponse> songsToBriefResponses(List<Song> songs) {
        if (songs == null) {
            return Collections.emptyList();
        }
        // Quan trọng: Gọi phương thức songToSongBriefResponse trong *cùng* interface này
        return songs.stream()
                .map(this::songToSongBriefResponse)
                .collect(Collectors.toList());
    }

    // --- Ánh xạ cho từng đối tượng con ---
    // Các phương thức này cũng cần thiết và được giữ lại ở đây.

    /**
     * Chuyển đổi Album entity sang AlbumBriefResponse DTO.
     * @param album Album entity
     * @return AlbumBriefResponse DTO
     */
    AlbumBriefResponse albumToAlbumBriefResponse(Album album);

    /**
     * Chuyển đổi Song entity sang SongBriefResponse DTO.
     * @param song Song entity
     * @return SongBriefResponse DTO
     */
    SongBriefResponse songToSongBriefResponse(Song song);
}
