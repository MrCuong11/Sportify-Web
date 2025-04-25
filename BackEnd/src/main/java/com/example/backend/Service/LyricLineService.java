package com.example.backend.Service;

import com.example.backend.Entity.LyricLine;
import com.example.backend.Repository.LyricLineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LyricLineService {

    @Autowired
    private LyricLineRepository lyricLineRepository;

    public void saveAll(List<LyricLine> lyrics) {
        lyricLineRepository.saveAll(lyrics);
    }
}
