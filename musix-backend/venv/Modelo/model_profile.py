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

    res = self.cProfile.insert_one({
      'user_id':ObjectId(self.idUser),
      'playlists':[
        {
          'playlist_id' : self.idPlaylist
        }
      ]
    })

    return jsonify({'status':True,  'message':'Profile Updated'})