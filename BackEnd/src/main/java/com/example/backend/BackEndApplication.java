package com.example.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackEndApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackEndApplication.class, args);
        System.out.println("GOOGLE_APPLICATION_CREDENTIALS = " + System.getenv("GOOGLE_APPLICATION_CREDENTIALS"));
    }

}
