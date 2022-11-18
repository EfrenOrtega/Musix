from Modelo.conexion import Conexion
from flask_pymongo import PyMongo, ObjectId
from flask import jsonify, request
import json
import dateutil
from bson import json_util

from Modelo.model_profile import ModelProfile

class ModelPlaylist():

  db = Conexion.connect()
  cPlaylist = db.playlist
  cSongs = db.songs
  cUsers = db.users
  cProfile = db.profile

  mProfile = ModelProfile()


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

    playlistOfUserExist = self.cPlaylist.find_one({
        '$and':[
          {
            'name':'Favorites'
          },
          {
            'user_id':ObjectId(self.iduser)
          }
        ]
      })

    song.append(self.cPlaylist.find_one({
      'songs':{
        '$elemMatch':{'song_id':ObjectId(self.idsong)}
        }
      }
    ))

    
    if(song[0] and playlistOfUserExist):
      #Remove song of Favorites, because the user click again on the favorite button 
      #of the same song
      self.delete_favorite()
      return jsonify({'status':False, 'message':'The Song has been Removed from Favorites'})
    else:

      #self.cPlaylist.find_one({'name':'Favorites'})


      #if(self.idPlaylist):
        #playlistOfUserExist = self.cProfile.find_one({
        #  '$and':[
        #    {'playlists':{
        #      '$elemMatch':{'playlist_id':ObjectId(self.idPlaylist)}
        #    }},
        #    {
        #      'user_id':ObjectId(self.iduser)
        #    }
        #  ]
        #})

      playlistOfUserExist = self.cPlaylist.find_one({
        '$and':[
          {
            'name':'Favorites'
          },
          {
            'user_id':ObjectId(self.iduser)
          }
        ]
      })
      

      if(playlistOfUserExist):
        print("PLAYLIST FAVORITE EXIST")
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
          'background':[
            'https://ipfs.filebase.io/ipfs/QmVEMj1uaEHGwDDbzDEZEuPajXuLxLprEYwQwmFxrn63c4'
          ],
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

        self.mProfile.idUser = self.iduser
        self.mProfile.idPlaylist = res.inserted_id
        self.mProfile.add_playlist()

        return jsonify({'status':True, 'message':'Song has been Added to Favorite'})


  #==================================
  #   ADD ANOTHER SONG TO FAVORITES
  #==================================
  def add_another_favorite(self):

    songs = []
    currentSongs = []

    #1.- Get the array "songs" from MongoDB
    for data in self.cPlaylist.find({'$and':[
          {
            'name':'Favorites'
          },
          {
            'user_id':ObjectId(self.iduser)
          }
        ]}):
      songs = data['songs']
    
    #2.- Get each song ID from the array "songs" 
    for data in songs:
      currentSongs.append(data)

    #3.- Add an object with the new song to "currentSongs"
    currentSongs.append({
      'song_id':ObjectId(self.idsong)
    })

    #4.- Update the array songs from mongodb with the "currentSongs"
    self.cPlaylist.find_one_and_update({'$and':[
          {
            'name':'Favorites'
          },
          {
            'user_id':ObjectId(self.iduser)
          }
        ]}, 
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
    for data in self.cPlaylist.find({'$and':[
          {
            'name':'Favorites'
          },
          {
            'user_id':ObjectId(self.iduser)
          }
        ]}):
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
       self.cPlaylist.update_one({'$and':[
          {
            'name':'Favorites'
          },
          {
            'user_id':ObjectId(self.iduser)
          }
        ]}, 
       {'$pop':{'songs':elementToDelete}})

       return True
       
    else:
      return False


  def get_playlists(self):
    playlists = []
    for data in self.cPlaylist.find({'$and':[
          {
            'name':'Favorites'
          },
          {
            'user_id':ObjectId(self.iduser)
          }
        ]}):
      playlists.append({
        '_id':str(ObjectId(data['_id'])),
        'user_id':str(ObjectId(data['user_id'])),
        'name':data['name'],
        'background':data['background'],
        'created':data['created'],
        'createdBy':data['createdBy'],
        'songs':json.loads(json_util.dumps(data['songs'])),
        'visibility':data['visibility']
      })

    return jsonify({'status':True, 'results':playlists})



  def get_song_playlists(self):
    song = self.cSongs.find_one({'_id':ObjectId(self.idsong)})

    return jsonify({'status':True, 'message':'Song Found', 
      'results': {
        '_id':str(ObjectId(song['_id'])),
        'name':song['name'],
        'album':song['album'],
        'artist':song['artist'],
        'genre':song['genre'],
        'cover':song['cover'],
        'duration':song['duration'],
        'url':song['url'],
        'date':song['date']
      }
    })
