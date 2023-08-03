package com.example.musixmanager.songs;

import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.scene.Node;
import javafx.scene.control.Button;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.VBox;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

public class SongFormController {

    private SongController songController;

    @FXML
    private VBox form_song;

    @FXML
    private ImageView imgCover;

    public void setSongController(SongController songController) {
        this.songController = songController;
    }

    @FXML
    public void onCancel(){
        this.songController.onCancel(form_song);
    }

    @FXML
    public void onUploadImg(){
        imgCover.setImage(new Image(""));
    }

    @FXML
    public void onSave(){
        try {
            String apiUrl = "http://192.168.1.71:5000/addsong";
            //Create a JSON objet with the data will be to send it.
            JSONObject jsonData = new JSONObject();
            jsonData.put("name", "Song");
            jsonData.put("artist", "artist");
            jsonData.put("album", "album");
            jsonData.put("genre", "genre");
            jsonData.put("cover", "");
            jsonData.put("duration", "0:00");
            jsonData.put("url", "");
            jsonData.put("date", "2023-08-02");
            jsonData.put("lyrics", "");

            HttpUtils.addSong(apiUrl, jsonData);
        }catch (Exception e){

        }
    }


}
