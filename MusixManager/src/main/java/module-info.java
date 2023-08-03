module com.example.musixmanager {
    requires javafx.controls;
    requires javafx.fxml;
    requires json;
    requires com.fasterxml.jackson.core;
    requires com.fasterxml.jackson.databind;


    opens com.example.musixmanager to javafx.fxml;
    exports com.example.musixmanager;

    exports com.example.musixmanager.home;
    opens com.example.musixmanager.home to javafx.fxml;

    exports com.example.musixmanager.songs;
    opens com.example.musixmanager.songs to javafx.fxml;

}