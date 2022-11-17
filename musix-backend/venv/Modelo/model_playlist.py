from Modelo.conexion import Conexion
from flask_pymongo import PyMongo, ObjectId
from flask import jsonify, request
import json
import dateutil


class ModelPlaylist():

  db = Conexion.connect()
  cPlaylist = db.playlist
  cSongs = db.songs
  cUsers = db.users

  idsong = None
  iduser = None
  idPlaylist = None
  date = None

  def __init__(self):
    pass

  #=====================================
  #   ADD THE FIRST SONG TO FAVORITES
  #=====================================
  def add_favorite(self):

    #Validation if song doesn't exist yet
    song = []
    song.append(self.cPlaylist.find_one({
      'songs':{
        '$elemMatch':{'song_id':ObjectId(self.idsong)}
        }
      }
    ))

    if(song[0]):
      #Remove song of Favorites, because the user click again on the favorite button 
      #of the same song
      self.delete_favorite()
      return jsonify({'status':False, 'message':'The Song has been Removed from Favorites'})
    else:

      if(self.cPlaylist.find_one({'name':'Favorites'})):
        #Update the Playlist because already the Playlist called "Favorites"
        self.add_another_favorite()
        return jsonify({'status':True, 'message':'Song has been Added to Favorite'})
      else:
        user = []

        #Get the user ID from mongoDB
        for data in self.cUsers.find({'_id':ObjectId(self.iduser)}):
          user.append({'name':data['name']})

        #Insert a New Object called "Favorites"
        res = self.cPlaylist.insert_one({
          'user_id':ObjectId(self.iduser),
          'name':'Favorites',
          'created':dateutil.parser.parse(self.date),
          'createdBy':user[0]['name'],
          'songs':[
            {
            'song_id': ObjectId(self.idsong)
            }
          ]            
          ,
          'visibility':True,
          })

        return jsonify({'status':True, 'message':'Song has been Added to Favorite'})


  #==================================
  #   ADD ANOTHER SONG TO FAVORITES
  #==================================
  def add_another_favorite(self):

    songs = []
    currentSongs = []

    #1.- Get the array "songs" from MongoDB
    for data in self.cPlaylist.find(({"name":"Favorites"})):
      songs = data['songs']
    
    #2.- Get each song ID from the array "songs" 
    for data in songs:
      currentSongs.append(data)

    #3.- Add an object with the new song to "currentSongs"
    currentSongs.append({
      'song_id':ObjectId(self.idsong)
    })

    #4.- Update the array songs from mongodb with the "currentSongs"
    self.cPlaylist.find_one_and_update({"name":"Favorites"}, 
    {'$set':{
      'songs':currentSongs
    }})

    return True

  
  #================================== Pending
  #    DELETE SONG OF FAVORITES
  #==================================
  def delete_favorite(self):
    songs = []
    currentSongs = []

    #1.- Get the array "songs" from MongoDB
    for data in self.cPlaylist.find(({"name":"Favorites"})):
      songs = data['songs']
    
    #2.- Get each song ID from the array "songs" but in "String"
    for data in songs:
      currentSongs.append(str(data['song_id']))


    #3.- Get the position of the ID song to delete
    elementToDelete = -1 
    for data in currentSongs:
      elementToDelete += 1
      if(data == self.idsong):#When we find the ID song: break
        break   
    
    #4.- If we found the ID song so delete a element from songs array in the position "elementToDelete" from MongoDB
    if(elementToDelete > -1):
       self.cPlaylist.update_one({'name':'Favorites'}, 
       {'$pop':{'songs':elementToDelete}})

       return True
       
    else:
      return False