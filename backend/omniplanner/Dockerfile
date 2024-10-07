FROM eclipse-temurin:17-jdk-focal

WORKDIR /app

# Copy Gradle wrapper and build files
COPY backend/omniplanner/gradlew /app/gradlew
COPY backend/omniplanner/build.gradle backend/omniplanner/settings.gradle /app/
COPY backend/omniplanner/gradle /app/gradle

# Ensure gradlew has executable permissions
RUN chmod +x /app/gradlew

# Run the Gradle build to download dependencies
RUN /app/gradlew build --no-daemon || return 0

# Copy the rest of the application source code
COPY backend/omniplanner /app

# Build the application
RUN /app/gradlew build --no-daemon

EXPOSE 8080

CMD ["java", "-jar", "/app/build/libs/omniplanner-0.0.1-SNAPSHOT.jar"]
