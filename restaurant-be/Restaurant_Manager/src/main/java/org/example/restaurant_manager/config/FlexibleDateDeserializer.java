package org.example.restaurant_manager.config;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonMappingException;

public class FlexibleDateDeserializer extends JsonDeserializer<Date> {

    private static final List<DateTimeFormatter> SUPPORTED_FORMATTERS = List.of(
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSSSSS"),
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
    );

    @Override
    public Date deserialize(JsonParser parser, DeserializationContext context) throws IOException {
        String value = parser.getValueAsString();

        if (value == null || value.isBlank()) {
            return null;
        }

        try {
            return Date.from(Instant.parse(value));
        } catch (DateTimeParseException ignored) {
        }

        for (DateTimeFormatter formatter : SUPPORTED_FORMATTERS) {
            try {
                LocalDateTime dateTime = LocalDateTime.parse(value, formatter);
                return Date.from(dateTime.atZone(ZoneId.systemDefault()).toInstant());
            } catch (DateTimeParseException ignored) {
            }
        }

        throw JsonMappingException.from(parser,
                "Invalid invoice date format. Supported formats: yyyy-MM-dd HH:mm:ss.SSSSSS, yyyy-MM-dd HH:mm:ss, ISO-8601");
    }
}