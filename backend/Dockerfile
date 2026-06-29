# Use Java 21
FROM eclipse-temurin:21-jdk

WORKDIR /app

# Copy project files
COPY . .

# Build the Spring Boot application
RUN mvn clean package -DskipTests

# Spring Boot listens on 8080
EXPOSE 8080

# Run the generated JAR
CMD ["sh", "-c", "java -jar target/*.jar"]