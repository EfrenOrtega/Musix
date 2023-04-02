from Modelo.conexion import Conexion
from flask_pymongo import PyMongo, ObjectId
from flask import jsonify, request
from pymongo import DESCENDING

import json

class ModelHistory():

  db = Conexion.connect()
  cHistory= db.history
  cSongs = db.songs
  limitItems = 0

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
    songs = [];

    for data in self.cHistory.find().sort([("_id", DESCENDING)]).limit(int(self.limitItems)):
      songs.append({
        '_id':str(ObjectId(data['_id'])),
        '_idUser':data['_idUser'],
        '_idSong':data['_idSong'],
        'date':data['date']
      })

    songsHistory = []
    for data in songs:
      song = self.cSongs.find_one({'_id': ObjectId(data['_idSong'])})
      songsHistory.append({
        '_id':str(ObjectId(song['_id'])),
        'name':song['name'],
        'album':song['album'],
        'artist':song['artist'],
        'genre':song['genre'],
        'cover':song['cover'],
        'duration':song['duration'],
        'url':song['url'],
        'date':song['date']
      })

    return jsonify(songsHistory)