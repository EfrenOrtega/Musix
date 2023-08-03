package com.example.musixmanager.songs;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import javafx.application.Platform;
import javafx.concurrent.Task;

import java.util.List;

public class SongsDataLoader {

    private SongController songController;

    public SongsDataLoader(SongController songController) {
        this.songController = songController;
        loadDataInBackground();
    }

    //Load the Data in the background used Task.class
    private void loadDataInBackground() {

        //Create the Task which will execute loadSongsDataFromServer() in other Thread
        Task<List<Song>> loadDataTask = new Task<>() {
            @Override
            protected List<Song> call() throws Exception {
                return loadSongsDataFromServer();
            }
        };

        //If all is good, get the data and call onDataLoaded() from SongController.java
        loadDataTask.setOnSucceeded(event -> {
            List<Song> songs = loadDataTask.getValue();
            songController.onDataLoaded(songs);
        });

        //Error
        loadDataTask.setOnFailed(event -> {
            loadDataTask.getException().printStackTrace();
        });

        //Create a Thread and Start Task
        Thread loadDataThread = new Thread(loadDataTask);
        loadDataThread.start();
    }

    // Load the songs data from server
    private List<Song> loadSongsDataFromServer() {

        try{
            String url = "http://192.168.1.71:5000/getsongs";

            String response = HttpUtils.getSongs(url);

            if (response != null) {

                ObjectMapper objectMapper = new ObjectMapper();
                List<Song> songs = objectMapper.readValue(response.toString(), new TypeReference<List<Song>>() {});

                return songs;
            } else {
                System.out.println("Error to get the Response");
            }

        }catch (Exception e){
            e.printStackTrace();
        }

        return null;
    }
}