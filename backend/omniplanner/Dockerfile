# Stage 1: Build the JAR file using a Gradle build environment
FROM eclipse-temurin:17-jdk-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Copy Gradle wrapper, settings, and build files
COPY build.gradle settings.gradle gradlew ./
COPY gradle ./gradle

# Give executable permissions to the Gradle wrapper
RUN chmod +x ./gradlew

# Download dependencies
RUN ./gradlew build --no-daemon || return 0

# Copy the rest of the application source code
COPY . .

# Build the application and generate the JAR file
RUN ./gradlew build --no-daemon

# Stage 2: Run the application using a smaller JRE image
FROM eclipse-temurin:17-jre-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the JAR file from the build stage
COPY --from=builder /app/build/libs/omniplanner-0.0.1-SNAPSHOT.jar /app/omniplanner.jar

# Expose port 8080 to the outside world
EXPOSE 8080

# Run the JAR file
CMD ["java", "-jar", "/app/omniplanner.jar"]
