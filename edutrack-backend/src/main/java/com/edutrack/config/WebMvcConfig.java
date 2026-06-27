package com.edutrack.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.io.File;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${edutrack.upload.dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Map /uploads/** requests to the local uploads directory
        File dir = new File(uploadDir);
        String absolutePath = dir.getAbsolutePath();
        
        // Ensure proper file:// prefix depending on OS
        String resourcePath = "file:" + absolutePath + File.separator;
        
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(resourcePath);
    }
}
