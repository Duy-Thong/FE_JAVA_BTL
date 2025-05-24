package com.javaBTL.BE_JAVA_BTL;

import com.javaBTL.BE_JAVA_BTL.repository.CartRepository;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
public class BeJavaBtlApplication {

	public static void main(String[] args) {
		SpringApplication.run(BeJavaBtlApplication.class, args);
	}

}
