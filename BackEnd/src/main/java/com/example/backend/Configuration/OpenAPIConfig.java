package com.example.backend.Configuration;

import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import io.swagger.v3.oas.models.OpenAPI;


//http://localhost:8080/swagger-ui/index.html
@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Movie App API")
                        .description("API Docs")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("MrCuong")
                                .email("nmanhcuong.cpf@gmail.com")
                                .url(""))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("http://springdoc.org")));
    }

}