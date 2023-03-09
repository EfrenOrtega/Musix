from Modelo.conexion import Conexion
from flask_pymongo import PyMongo, ObjectId
from flask import jsonify, request

import json

class 	ModelSongs():
  db = Conexion.connect()
  cSongs = db.songs
  cProfile = db.profile
  artist = ''
  idUser = ''

  def __init__(self):
    pass

  def add_song(self):

    res = self.cSongs.insert_one({
        'name':request.json['name'],
        'artist':request.json['artist'],
        'album':request.json['album'],
        'genre':request.json['genre'],
        'cover':request.json['cover'],
        'duration':request.json['duration'],
        'url':request.json['url'],
        'date':request.json['date']
      })

    return jsonify({'status':True, 'message':'Songs Added'})


  def get_songs(self):
    songs = []
    for data in self.cSongs.find():

      songs.append({
        '_id':str(ObjectId(data['_id'])),
        'name':data['name'],
        'album':data['album'],
        'artist':data['artist'],
        'genre':data['genre'],
        'cover':data['cover'],
        'duration':data['duration'],
        'url':data['url'],
        'date':data['date']
      })

    return jsonify(songs)

  def get_recent_songs(self):
    songs = []
    #for data in self.cSongs.find({'date':dateutil.parser.parse(self.date)}):
    for data in self.cSongs.find().sort("_id", -1).limit(8):
      songs.append({
        '_id':str(ObjectId(data['_id'])),
        'name':data['name'],
        'album':data['album'],
        'artist':data['artist'],
        'genre':data['genre'],
        'cover':data['cover'],
        'duration':data['duration'],
        'url':data['url'],
        'date':data['date']
      })


    return jsonify(songs)

  
  def get_songsByArtist(self):
    songs = []
    for data in self.cSongs.find({'artist':self.artist}):

      songs.append({
        '_id':str(ObjectId(data['_id'])),
        'name':data['name'],
        'album':data['album'],
        'artist':data['artist'],
        'genre':data['genre'],
        'cover':data['cover'],
        'duration':data['duration'],
        'url':data['url'],
        'date':data['date']
      })

    return jsonify(songs)


  def get_recommended_songs(self):

    userprofile = self.cProfile.find_one({'user_id':ObjectId(self.idUser)})
    if(not userprofile):
      return jsonify({'status':False, 'message':"There aren't a likes songs yet"})

    songs = []

    for data in self.cSongs.find({'genre':userprofile['favorite_genre']}):
      songs.append({
        '_id':str(ObjectId(data['_id'])),
        'name':data['name'],
        'album':data['album'],
        'artist':data['artist'],
        'genre':data['genre'],
        'cover':data['cover'],
        'duration':data['duration'],
        'url':data['url'],
        'date':data['date']
      })

    return jsonify(songs)


  def get_my_likes(self):
    userprofile = self.cProfile.find_one({'user_id':ObjectId(self.idUser)})

    if(not userprofile): 
      return jsonify({'status':False, 'message':"There aren't a likes songs yet"})
    else:
      songs = []

      for data in self.cSongs.find({'artist':userprofile['favorite_artist']}):
        songs.append({
          '_id':str(ObjectId(data['_id'])),
          'name':data['name'],
          'album':data['album'],
          'artist':data['artist'],
          'genre':data['genre'],
          'cover':data['cover'],
          'duration':data['duration'],
          'url':data['url'],
          'date':data['date']
        })

      return jsonify(songs)