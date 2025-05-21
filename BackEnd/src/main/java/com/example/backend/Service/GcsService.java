package com.example.backend.Service;
import com.google.cloud.storage.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class GcsService {

    private final String bucketName = "music-app-audio-2025";

    public String uploadFile(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID() + "-" + file.getOriginalFilename();

        Storage storage = StorageOptions.getDefaultInstance().getService();

        BlobId blobId = BlobId.of(bucketName, fileName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(file.getContentType()).build();

        storage.create(blobInfo, file.getBytes());

        // Public URL (nếu object có quyền public read)
        return String.format("https://storage.googleapis.com/%s/%s", bucketName, fileName);
    }
}

