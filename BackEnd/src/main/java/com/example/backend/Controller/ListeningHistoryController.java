package com.example.backend.Controller;

import com.example.backend.DTO.Request.ApiResponse;
import com.example.backend.DTO.Response.ListeningHistoryResponseDTO;
import com.example.backend.Service.ListeningHistoryService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/history")
public class ListeningHistoryController {

    private final ListeningHistoryService listeningHistoryService;

    public ListeningHistoryController(ListeningHistoryService listeningHistoryService) {
        this.listeningHistoryService = listeningHistoryService;
    }

    @GetMapping
    public ApiResponse<Page<ListeningHistoryResponseDTO>> getAllListeningHistory(
            @RequestParam String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<ListeningHistoryResponseDTO> result = listeningHistoryService.getAllListeningHistory(userId, page, size);
        return ApiResponse.<Page<ListeningHistoryResponseDTO>>builder()
                .result(result)
                .build();
    }
}