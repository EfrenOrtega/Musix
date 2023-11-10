from Services.mongoDB import Conexion
from flask_pymongo import PyMongo, ObjectId
from flask import jsonify, request

import json

class ModelArtist():
  db = Conexion.connect()
  cArtist = db.artists
  idartist = None


  def __init__(self):
    pass


  def insertArtist(self):
    res = self.cArtist.insert_one({
        'name':request.json['name'],
        'background':request.json['background'],
        'profile_image':request.json['profile_image']
      })

    return jsonify({'status':True, 'message':'Artist Added'})    


  def getArtists(self):
    artists = []
    for data in self.cArtist.find():

      artists.append({
        'id':str(ObjectId(data['_id'])),
        'name':data['name'],
        'background':data['background'],
        'profile_image':data['profile_image']
      })   


    return jsonify(artists)  


  def getArtist(self):
    data = self.cArtist.find_one({'_id':ObjectId(self.idartist)})

    return jsonify({
      'id':str(ObjectId(data['_id'])),
      'name':data['name'],
      'background':data['background'],
      'profile_image':data['profile_image']
    }) 
      