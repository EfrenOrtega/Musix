from Modelo.conexion import Conexion
from flask_pymongo import PyMongo, ObjectId
from flask import jsonify, request
import json
import dateutil
from bson import json_util

class ModelProfile():

  db = Conexion.connect()
  cProfile = db.profile

  idPlaylist = None
  idUser = None

  def __init__(self):
    pass


  def add_playlist(self):

    profile = []
    profile.append(self.cProfile.find_one({'user_id':ObjectId(self.idUser)}))

    if(profile[0]):

      currentPlaylists = []
      playlists = []

      #1.- Get the array "playlists" from MongoDB
      for data in self.cProfile.find({'user_id':ObjectId(self.idUser)}):
        playlists = data['playlists']


      #2.- Get each playlist ID from the array "playlists" 
      for data in playlists:
        if(data != ''):
          currentPlaylists.append(data)


      #3.- Add an object with the new playlist to "currentSongs"
      currentPlaylists.append({
        'playlist_id':ObjectId(self.idPlaylist)
      })

      self.cProfile.find_one_and_update({'user_id':ObjectId(self.idUser)}, 
      {'$set':{
        'playlists':currentPlaylists
      }})
    else:  

      res = self.cProfile.insert_one({
        'user_id':ObjectId(self.idUser),
        'playlists':[
          {
            'playlist_id' : self.idPlaylist
          }
        ],
        'favorites_artist':[]
      })

    return jsonify({'status':True,  'message':'Profile Updated'})