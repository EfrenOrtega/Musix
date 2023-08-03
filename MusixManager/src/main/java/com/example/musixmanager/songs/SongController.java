package com.example.musixmanager.songs;

import javafx.application.Platform;
import javafx.collections.ObservableList;
import javafx.concurrent.Task;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.control.Label;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.AnchorPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.scene.paint.Color;

import java.util.ArrayList;
import java.util.List;

import java.io.IOException;
import java.util.Objects;

public class SongController {

    private List<HBox> vhboList = new ArrayList<>();

    @FXML
    public AnchorPane container;

    @FXML
    private VBox crud_songs;

    @FXML
    private VBox column_cover;

    @FXML
    private VBox column_name;

    @FXML
    private VBox column_artist;

    @FXML
    private VBox column_album;

    @FXML
    private VBox column_duration;

    @FXML
    private VBox column_lyrics;

    @FXML
    private VBox column_actions;

    public void initialize(){
        SongsDataLoader songsDataLoader = new SongsDataLoader(this);
    }

    //This 4 function are to create a row for the table. ====
    public void createRow(List<HBox> vhboList, String imageUrl, String name, String artist, String album, String duration, String lyrics){
        vhboList.add(createColumnCover(imageUrl));
        vhboList.add(createColumnText(name, "name"));
        vhboList.add(createColumnText(artist, "artist"));
        vhboList.add(createColumnText(album, "album"));
        vhboList.add(createColumnText(duration, "duration"));
        vhboList.add(createColumnText(lyrics, "lyrics"));
        vhboList.add(createColumnAction());
    }

    public HBox createColumnCover(String imageUrl){
        HBox data_cover = new HBox();

        Image image = new Image(imageUrl);
        ImageView imageView = new ImageView(image);

        imageView.setFitWidth(70);
        imageView.setFitHeight(70);
        imageView.setPreserveRatio(false);

        data_cover.getStyleClass().add("row");
        data_cover.getChildren().add(imageView);

        return data_cover;
    }

    public HBox createColumnText(String txt, String column){
        HBox data = new HBox();

        Label label = new Label();

        label.setText(txt);
        label.setTextFill(Color.WHITE);
        label.setStyle("-fx-font-size: 13px;");

        data.getStyleClass().add("row");
        data.getChildren().add(label);

        return data;

    }

    public HBox createColumnAction(){
        HBox actions = new HBox();

        Image delete = new Image(getClass().getResourceAsStream("/com/example/musixmanager/images/delete.png"));
        Image edit = new Image(getClass().getResourceAsStream("/com/example/musixmanager/images/edit.png"));

        ImageView imageViewDelete = new ImageView(delete);
        imageViewDelete.setFitWidth(22);
        imageViewDelete.setFitHeight(22);

        ImageView imageViewEdit = new ImageView(edit);
        imageViewEdit.setFitWidth(22);
        imageViewEdit.setFitHeight(22);

        actions.getStyleClass().add("row-actions");
        actions.getChildren().add(imageViewDelete);
        actions.getChildren().add(imageViewEdit);

        return actions;
    }
    //====                     ====                      ====


    public void FXMLoader(String ruta){
        try {
            // Load the FXML File
            FXMLLoader loader = new FXMLLoader(getClass().getResource(ruta));

            VBox content = loader.load();

            // Get the associated controller of the loaded FXML
            SongFormController songFormController = loader.getController();
            // Set the reference of the current SongController to the SongFormController
            songFormController.setSongController(this);

            container.setTopAnchor(content, 47.0);
            container.setBottomAnchor(content, 0.0);
            container.setLeftAnchor(content, 0.0);
            container.setRightAnchor(content, 0.0);

            // Set the Content for AnchorPane
            container.getChildren().add(content);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    //Navigate
    @FXML
    public void EventAddSong(){
        FXMLoader("/com/example/musixmanager/views/song-view.fxml");
        crud_songs.setVisible(false);
    }

    public void onCancel(VBox form_song){
        ObservableList<Node> children = container.getChildren();

        // Verify if the VBox is in the list and delete it
        if (children.contains(form_song)) {
            children.remove(form_song);
        }

        crud_songs.setVisible(true);
    }

    public void onDataLoaded(List<Song> songs) {

        Task<Void> renderDataTask = new Task<Void>() {
            @Override
            protected Void call() throws Exception {
                for (Song song : songs) {
                    final String name = song.getName();
                    final String artist = song.getArtist();
                    final String album = song.getAlbum();
                    final String duration = song.getDuration();
                    final String lyrics;

                    if(song.getLyrics() == ""){
                        lyrics = "No";
                    }else{
                        lyrics = "Yes";
                    }

                    final String imageUrl = song.getCover();

                    if(!Objects.equals(imageUrl, "")){
                        createRow(vhboList, imageUrl, name, artist, album, duration, lyrics);
                    }else{
                        continue;
                    }

                    Platform.runLater(() -> {
                            if (!column_cover.getChildren().contains(vhboList.get(0))) {
                                column_cover.getChildren().add(vhboList.get(0));
                            }

                            if (!column_name.getChildren().contains(vhboList.get(1))) {
                                column_name.getChildren().add(vhboList.get(1));
                            }

                            if (!column_artist.getChildren().contains(vhboList.get(2))) {
                                column_artist.getChildren().add(vhboList.get(2));
                            }

                            if (!column_album.getChildren().contains(vhboList.get(3))) {
                                column_album.getChildren().add(vhboList.get(3));
                            }

                            if (!column_duration.getChildren().contains(vhboList.get(4))) {
                                column_duration.getChildren().add(vhboList.get(4));
                            }

                            if (!column_lyrics.getChildren().contains(vhboList.get(5))) {
                                column_lyrics.getChildren().add(vhboList.get(5));
                            }

                            if (!column_actions.getChildren().contains(vhboList.get(6))) {
                                column_actions.getChildren().add(vhboList.get(6));
                            }

                        vhboList.clear();

                    });



                }

                return null;
            }
        };

        renderDataTask.setOnFailed(event -> {
            renderDataTask.getException().printStackTrace();
        });

        Thread renderDataThread = new Thread(renderDataTask);
        renderDataThread.start();


    }

}
