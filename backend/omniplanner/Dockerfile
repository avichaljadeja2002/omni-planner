FROM eclipse-temurin:17-jdk-focal

WORKDIR /app

COPY build.gradle settings.gradle ./
COPY gradlew ./
COPY gradle ./gradle

RUN ./gradlew build --no-daemon || return 0

COPY . .

RUN ./gradlew build --no-daemon

EXPOSE 8080

CMD ["java", "-jar", "build/libs/your-app-name.jar"]
