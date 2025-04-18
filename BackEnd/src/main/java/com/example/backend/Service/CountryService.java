package com.example.backend.Service;

import com.example.backend.DTO.Request.CountryCreationRequest;
import com.example.backend.DTO.Response.CountryResponse;
import com.example.backend.DTO.Response.CountryWithArtistsResponse;
import com.example.backend.Entity.Country;
import com.example.backend.Mapper.CountryMapper;
import com.example.backend.Repository.CountryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CountryService {
    private final CountryRepository countryRepository;
    private final CountryMapper countryMapper;

    public CountryResponse createCountry(CountryCreationRequest request) {
        Country country = countryMapper.toCountry(request);
        return countryMapper.toCountryResponse(countryRepository.save(country));
    }

    public void deleteCountry(Long id) {
        countryRepository.deleteById(id);
    }


    public CountryResponse getCountry(Long countryId) {
        Country country = countryRepository.findById(countryId)
                .orElseThrow(() -> new RuntimeException("Country not found"));
        return countryMapper.toCountryResponse(country);
    }

    public List<CountryResponse> getAllCountries() {
        return countryRepository.findAll().stream()
                .map(countryMapper::toCountryResponse)
                .toList();
    }

    public CountryWithArtistsResponse getCountryWithArtists(Long countryId) {
        Country country = countryRepository.findById(countryId)
                .orElseThrow(() -> new RuntimeException("Country not found"));
        return countryMapper.toCountryWithArtistsResponse(country);
    }
}
