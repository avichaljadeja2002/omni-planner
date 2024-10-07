FROM azul/zulu-openjdk:17-latest
VOLUME /tmp

COPY gradlew gradlew
COPY gradle gradle
COPY build.gradle build.gradle
COPY settings.gradle settings.gradle
COPY src src

RUN ./gradlew build --no-daemon

COPY build/libs/*.jar app.jar

ENTRYPOINT ["java","-jar","/app.jar"]
