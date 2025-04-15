package com.example.backend.Service;

import com.example.backend.DTO.Request.ArtistCreationRequest;
import com.example.backend.DTO.Response.ArtistDetailResponse;
import com.example.backend.DTO.Response.ArtistResponse;
import com.example.backend.Entity.Artist;
import com.example.backend.Entity.Country;
import com.example.backend.Mapper.ArtistDetailMapper;
import com.example.backend.Mapper.ArtistMapper;
import com.example.backend.Repository.ArtistRepository;
import com.example.backend.Repository.CountryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ArtistService {
    private final ArtistRepository artistRepository;
    private final CountryRepository countryRepository;
    private final ArtistMapper artistMapper;
    private final ArtistDetailMapper artistDetailMapper;

    public ArtistResponse createArtist(ArtistCreationRequest request) {
        Country country = countryRepository.findById(request.getCountryId())
                .orElseThrow(() -> new RuntimeException("Country not found"));

        Artist artist = artistMapper.toArtist(request, country);
        artist.setCountry(country);

        return artistMapper.toArtistResponse(artistRepository.save(artist));
    }

    @Transactional(readOnly = true) // Vẫn cần Transactional cho lazy loading
    public ArtistDetailResponse getArtistDetailsById(String id) {
        Artist artist = artistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artist not found with id: " + id));

        // Sử dụng mapper mới để chuyển đổi sang DTO chi tiết
        return artistDetailMapper.toArtistDetailResponse(artist); // <-- Sử dụng mapper mới ở đây
    }

    @Transactional(readOnly = true) // Thêm transactional cho nhất quán
    public Page<ArtistResponse> getAllArtists(Pageable pageable) {
        Page<Artist> artistPage = artistRepository.findAll(pageable);
        // Sử dụng map của Page để chuyển đổi nội dung
        return artistPage.map(artistMapper::toArtistResponse);
    }

    public void deleteArtist(String id) {
        artistRepository.deleteById(id);
    }

    public ArtistResponse updateArtist(String id, ArtistCreationRequest request) {
        Artist artist = artistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artist not found"));

        Country country = countryRepository.findById(request.getCountryId())
                .orElseThrow(() -> new RuntimeException("Country not found"));

        artistMapper.updateArtist(artist, request, country);
        artist.setCountry(country);

        return artistMapper.toArtistResponse(artistRepository.save(artist));
    }
}