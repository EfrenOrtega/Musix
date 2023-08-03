package com.example.musixmanager.home;

import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.control.ScrollPane;
import javafx.scene.layout.AnchorPane;

import java.io.IOException;

public class HomeController {

    @FXML
    public ScrollPane scrollPane;


    public void initialize(){
        FXMLoader("/com/example/musixmanager/views/songs-view.fxml");
    }

    public void FXMLoader(String ruta){
        try {
            // Load the FXML File
            FXMLLoader loader = new FXMLLoader(getClass().getResource(ruta));

            AnchorPane content = loader.load();

            // Set the Content for ScrollPane
            scrollPane.setContent(content);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
