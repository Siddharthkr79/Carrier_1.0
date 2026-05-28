# Build stage
FROM maven:3.8.5-eclipse-temurin-17 AS build
WORKDIR /app
COPY career-mitra/backend/pom.xml ./
RUN mvn dependency:go-offline -B
COPY career-mitra/backend/src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/target/career-mitra-backend-1.0.0.jar app.jar
ENV SPRING_PROFILES_ACTIVE=mysql
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
