FROM maven:3.9.9-eclipse-temurin-17

WORKDIR /app

COPY PrayagHuddarProject/backend .

RUN mvn clean package -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "target/backend-1.0.0.jar"]