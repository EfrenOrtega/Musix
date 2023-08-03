package com.example.musixmanager.songs;

import org.json.JSONException;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

public class HttpUtils {

    public static void addSong(String apiUrl, JSONObject jsonData) throws Exception {
        try {

            // Create the HTTP Connection
            URL url = new URL(apiUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setDoOutput(true);

            // Write JSON at the request body
            try (OutputStream outputStream = connection.getOutputStream()) {
                byte[] postData = jsonData.toString().getBytes(StandardCharsets.UTF_8);
                outputStream.write(postData);
            }

            //Read the connection response
            BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            reader.close();

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static String getSongs(String apiUrl) throws Exception {
        try {
            // Create the HTTP Connection
            URL url = new URL(apiUrl);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");

            // Read the connection response
            BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            reader.close();

            // Return the response as a string
            return response.toString();

        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }
}


