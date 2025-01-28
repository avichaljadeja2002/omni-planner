package com.main.omniplanner;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = {SecurityAutoConfiguration.class }, scanBasePackages = "com.main.omniplanner")
public class OmniplannerApplication {

	public static void main(String[] args) {
		SpringApplication.run(OmniplannerApplication.class, args);
	}

}
