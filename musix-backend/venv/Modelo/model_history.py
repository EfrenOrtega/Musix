from Modelo.model_playlist import ModelPlaylist
from Services.mongoDB import Conexion

from flask_pymongo import PyMongo, ObjectId
from flask import jsonify, request
from pymongo import DESCENDING

import json

class ModelHistory():

  db = Conexion.connect()
  Mod_playlist = ModelPlaylist()
  cHistory= db.history
  cSongs = db.songs
  limitItems = 0
  idUser = None

  def __init__(self):
    pass


  def updateHistory(self):
    self.cHistory.insert_one({
      '_idSong':request.json['idSong'],
      '_idUser':request.json['idUser'],
      'date':request.json['date']
    })

    return jsonify({'status':True, 'message':'Songs Added to History'})


  def getHistory(self):
    songs = []

    for data in self.cHistory.find().sort([("_id", DESCENDING)]).limit(int(self.limitItems)):
      songs.append({
        '_id':str(ObjectId(data['_id'])),
        '_idUser':data['_idUser'],
        '_idSong':data['_idSong'],
        'date':data['date']
      })

    songsHistory = []

    #Obtain the favorites songs
    self.Mod_playlist.iduser = self.idUser
    favorites_playlist = (json.loads(self.Mod_playlist.get_favorites().get_data(as_text=True)))['results'][0]
    favorite_song_ids = [ObjectId(s['_id']) for s in favorites_playlist['songs']]

    for data in songs:

      song = self.cSongs.find_one({'_id': ObjectId(data['_idSong'])})

      #Verify if the current song is a favorite song
      if song['_id'] in favorite_song_ids:
        song['favorite'] = True #Add a attribute called favorite with True if is a favorite song
      else:
        song['favorite'] = False #Add a attribute called favorite with False if isn't a favorite song

      songsHistory.append({
        '_id':str(ObjectId(song['_id'])),
        'name':song['name'],
        'album':song['album'],
        'artist':song['artist'],
        'genre':song['genre'],
        'cover':song['cover'],
        'duration':song['duration'],
        'url':song['url'],
        'date':song['date'],
        'lyrics':song['lyrics'],
        'favorite':song['favorite']
      })

    return jsonify(songsHistory)