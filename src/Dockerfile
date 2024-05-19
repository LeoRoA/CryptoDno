# Используем официальный образ OpenJDK как базовый
FROM openjdk:19-jdk-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем JAR файл в контейнер
COPY CryptoDno-0.0.1-SNAPSHOT.jar app.jar

# Устанавливаем точку входа для запуска JAR файла
ENTRYPOINT ["java", "-jar", "app.jar"]

# Указываем порт, который будет прослушивать ваше приложение
EXPOSE 3000
