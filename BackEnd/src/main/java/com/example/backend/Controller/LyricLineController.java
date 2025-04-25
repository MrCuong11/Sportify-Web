package com.example.backend.Controller;

import com.example.backend.DTO.Response.LyricUploadResponse;
import com.example.backend.DTO.Response.LyricLineDto;
import com.example.backend.DTO.Response.SongBriefResponse;
import com.example.backend.Entity.LyricLine;
import com.example.backend.Entity.Song;
import com.example.backend.Repository.SongRepository;
import com.example.backend.Service.LyricLineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@RestController
@RequestMapping()
public class LyricLineController {

    @Autowired
    private LyricLineService lyricLineService;

    @Autowired
    private SongRepository songRepository;

    @PostMapping(value = "/upload-lyrics", consumes = "multipart/form-data")
    public ResponseEntity<?> uploadLyricFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("songId") String songId) {

//        Check if Song Exists
        Optional<Song> songOptional = songRepository.findById(songId);
        if (songOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Song with ID " + songId + " not found.");
        }

        Song song = songOptional.get();

        try {
            BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8));
            List<LyricLine> lyricLines = new ArrayList<>();

            String line;
            while ((line = reader.readLine()) != null) {
                // Bỏ qua metadata như [ti:], [ar:], [id:], ...
                if (!line.matches(".*\\[\\d{2}:\\d{2}\\.\\d{2,3}].*")) {
                    continue;
                }

                // Regex để tìm tất cả timestamp [mm:ss.xx] trong dòng
                Pattern timestampPattern = Pattern.compile("\\[(\\d{2}):(\\d{2})\\.(\\d{2,3})]");
                Matcher matcher = timestampPattern.matcher(line);

                List<Double> times = new ArrayList<>();
                int lastMatchEnd = 0;

                while (matcher.find()) {
                    int minutes = Integer.parseInt(matcher.group(1));
                    int seconds = Integer.parseInt(matcher.group(2));
                    int milliseconds = Integer.parseInt(matcher.group(3));

                    double timeInSeconds = minutes * 60 + seconds + (milliseconds / 1000.0);
                    times.add(timeInSeconds);
                    lastMatchEnd = matcher.end();
                }

                String text = line.substring(lastMatchEnd).trim();

                for (double time : times) {
                    LyricLine lyricLine = new LyricLine();
                    lyricLine.setTimestamp(String.valueOf(time));
                    lyricLine.setText(text);
                    lyricLine.setSong(song);
                    lyricLines.add(lyricLine);
                }
            }

            // Lưu tất cả lyric lines vào database
            lyricLineService.saveAll(lyricLines);

            // Chuyển entity sang DTO
            List<LyricLineDto> lyricLineDtos = lyricLines.stream()
                    .map(lines -> new LyricLineDto(lines.getTimestamp(), lines.getText()))
                    .collect(Collectors.toList());

            LyricUploadResponse response = new LyricUploadResponse();
            response.setLyrics(lyricLineDtos); // Dùng DTO thay vì entity
            response.setSong(new SongBriefResponse(
                    song.getId(),
                    song.getTitle(),
                    song.getDuration()
            ));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error parsing file: " + e.getMessage());
        }
    }
}
