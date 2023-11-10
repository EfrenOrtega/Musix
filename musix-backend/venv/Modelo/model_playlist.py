from Services.mongoDB import Conexion
from flask_pymongo import ObjectId
from flask import jsonify, request
import json
import dateutil
from bson import json_util

from Modelo.model_profile import ModelProfile
from botocore.exceptions import ClientError

import os
from werkzeug.utils import secure_filename

import uuid

#=================================================== START
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
  imageFile = None
  nameImage = None
  urlImage = None

  def __init__(self):
    pass


  def create_favorite_playlis(self):
    user = []

    #Get the user ID from mongoDB
    for data in self.cUsers.find({'_id':ObjectId(self.iduser)}):
      user.append({'name':data['name']})

     #Insert a New Object called "Favorites"
    res = self.cPlaylist.insert_one({
      'user_id':ObjectId(self.iduser),
      'name':'Favorites',
      'background':[
         'https://ipfs.filebase.io/ipfs/QmaNbzvqbwmyku7KsgRWe8DJmqrjG2UzKfY3f3YxZAarBG'
       ],
      'created':dateutil.parser.parse(self.date),
      'createdBy':user[0]['name'],
      'songs':[],
      'visibility':True,
    })  
    
    self.mProfile.idUser = self.iduser
    self.mProfile.idPlaylist = res.inserted_id
    self.mProfile.add_playlist()

    return jsonify({'status':True, 'message':'Favorite Created'})


  #=====================================
  #   ADD THE FIRST SONG TO FAVORITES
  #=====================================
  def add_favorite(self):

    #Validation if song doesn't exist yet
    song = []

    #Validation if playlist doesn't exist yet
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

    song.append(self.cPlaylist.find_one({'$and':[
      {
        'user_id':ObjectId(self.iduser)
      },
      {
        'name':'Favorites'
      },
      {
      'songs':{
        '$elemMatch':{'song_id':ObjectId(self.idsong)}
        }
      }
    ]}
    ))

    
    if(song[0] and playlistOfUserExist):
      #Remove song of Favorites, because the user click again on the favorite button 
      #of the same song

      self.delete_favorite()
      return jsonify({'status':False, 'message':'The Song has been Removed from Favorites'})
    else:

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
#========================================================================================== END

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
      self.cPlaylist.update_one(
        {'$and':[
          {
            'name':'Favorites'
          },
          {
            'user_id':ObjectId(self.iduser)
          }
        ]},
        {
          "$unset": {f"songs.{elementToDelete}": 1},
        }
       )

      self.cPlaylist.update_one(
        
        {'$and':[
          {
            'name':'Favorites'
          },
          {
            'user_id':ObjectId(self.iduser)
          }
        ]},
        {
        "$pull": {"songs": None}
        }
       )
    
      return True
       
    else:
      return False


  def get_playlists(self):
    playlists = []

    favorites_playlist = (json.loads(self.get_favorites().get_data(as_text=True)))['results'][0]
    favorite_song_ids = [ObjectId(s['_id']) for s in favorites_playlist['songs']]

    song_ids = []          

    for data in self.cPlaylist.find({'user_id':ObjectId(self.iduser)}):

      #This is to create an array but with the song ids, is like the .map() in JS
      song_ids = [s['song_id'] for s in data['songs']]
      
      #This is to aggregate data in a specific document (No update the document in mongo)
      songs = self.cSongs.aggregate([
        {'$match': {'_id':{'$in':song_ids}}},#Find the song_ids in cSongs
        {'$addFields':{
          '_id':{'$toString':'$_id'},#Convert the _id song to string
          'favorite': {'$in': ['$_id', favorite_song_ids]}, #Add other field called favorite, this
          #search if favorite_song_ids has _id song and return a Boolean (true, false)
        }}
      ])

      #Load the new list a data['songs']
      data['songs'] = list(songs)

      playlists.append({
        '_id':str(ObjectId(data['_id'])),
        'user_id':str(ObjectId(data['user_id'])),
        'name':data['name'],
        'background':data['background'],
        'created':data['created'],
        'createdBy':data['createdBy'],
        'songs':data['songs'],
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


  def create_playlist(self):

    jsonData = json.load(request.files['Form'])


    #Validation if playlist doesn't exist yet
    playlistOfUserExist = self.cPlaylist.find_one({
        '$and':[
          {
            'name':(jsonData['dataForm']['name']).strip()
          },
          {
            'user_id':ObjectId(jsonData['idUser'])
          }
        ]
      })

    if(playlistOfUserExist):
      return jsonify({'status':False, 'message':'The playlist already exist'})

    try:
      if(request.files['File']):
        self.imageFile = request.files['File']
        self.upload_file()
        self.upload_to_filebase()

        user = self.cUsers.find_one({'_id': ObjectId(jsonData['idUser'])})

        res = self.cPlaylist.insert_one({
        'user_id':ObjectId(jsonData['idUser']),
        'name':(jsonData['dataForm']['name']).strip(),
        'background':[
          self.urlImage
        ],
        'created':jsonData['created'],
        'createdBy':user['name'],
        'songs':[],
        'visibility':True
        })

    except:
      user = self.cUsers.find_one({'_id': ObjectId(jsonData['idUser'])})

      res = self.cPlaylist.insert_one({
        'user_id':ObjectId(jsonData['idUser']),
        'name':jsonData['dataForm']['name'],
        'background':['https://ipfs.filebase.io/ipfs/QmZVKWX9ZEtgT4YmZWoZYDoin7puHgRnZs2etd9pdzJveX'],
        'created':jsonData['created'],
        'createdBy':user['name'],
        'songs':[],
        'visibility':True
      })


    self.mProfile.idUser = self.iduser
    self.mProfile.idPlaylist = res.inserted_id
    self.mProfile.add_playlist()
    

    return jsonify({'status':True, 'Message':'New Playlist created'})



  def upload_file(self):
    try:
      #To upload an Imagen to this Flask server
      file = self.imageFile
      Path = os.path.join(os.path.dirname(__file__))    
      UPLOAD_FOLDER = os.path.join(os.path.dirname(Path), 'images')

      filename = secure_filename(file.filename)
      extension = os.path.splitext(filename)[1]

      newName = str(uuid.uuid4()) + extension

      upload_path = os.path.join(UPLOAD_FOLDER, newName)
      
      file.save(upload_path)

      self.nameImage = newName
    
      return jsonify({'status':True, 'message':'Imagen Uploaded'})
    except ClientError as e:
      print('error: %s') % e
      return jsonify({'status':False, 'message':'Error to Upload the Image'})



  def upload_to_filebase(self):
    CDI = None

    from Services.fileBase import s3;

    image = self.nameImage
    #Para Subir un nuevo objeto a un Bucket en este caso una imagen
    currentPath = os.path.join(os.path.dirname(__file__))    
    pathImage = os.path.join(os.path.dirname(currentPath), 'images', image)

    with open(pathImage, 'rb') as data:
      try:    

        #Insertar objeto al bucket "movies-3077"
        request = s3.put_object(
          Body=data,
          Bucket="musix-3066",
          Key = 'covers-playlists/' + self.nameImage, 
          ContentType = 'imagen/jpeg'
        )
        
        CDI = request['ResponseMetadata']['HTTPHeaders']['x-amz-meta-cid']

        #Recuperamos la URL del la imagen ya una vez subida a https://filebase.com/
        self.urlImage = 'https://ipfs.filebase.io/ipfs/' + CDI

      except ClientError as e:
        print('error: %s') % e
        return 'error'


  def get_playlist(self):
    
    playlist = []
    data = self.cPlaylist.find_one({'_id':ObjectId(self.idPlaylist)})

    self.iduser = str(ObjectId(data['user_id']))
    favorites_playlist = (json.loads(self.get_favorites().get_data(as_text=True)))['results'][0]

    favorite_song_ids = [ObjectId(s['_id']) for s in favorites_playlist['songs']]

    song_ids = []

    #This is to create an array but with the song ids, is like the .map() in JS
    song_ids = [s['song_id'] for s in data['songs']]
      
    #This is to aggregate data in a specific document (No update the document in mongo)
    songs = self.cSongs.aggregate([
      {'$match': {'_id':{'$in':song_ids}}},#Find the song_ids in cSongs
      {'$addFields':{
        '_id':{'$toString':'$_id'},#Convert the _id song to string
        'favorite': {'$in': ['$_id', favorite_song_ids]}, #Add other field called favorite, this
        #search if favorite_song_ids has _id song and return a Boolean (true, false)
      }}
    ])

    #Load the new list a data['songs']
    data['songs'] = list(songs)

    playlist.append({
      '_id':str(ObjectId(data['_id'])),
      'user_id':str(ObjectId(data['user_id'])),
      'name':data['name'],
      'background':data['background'],
      'created':data['created'],
      'createdBy':data['createdBy'],
      'songs':data['songs'],
      'visibility':data['visibility']
    })

    return jsonify({'status':True, 'results':playlist})


  def add_to_playlist(self):

    song = []

    songs = []
    currentSongs = []

    try:

      song.append(self.cPlaylist.find_one({'$and':[
        {
          '_id':ObjectId(self.idPlaylist)
        },
        {
        'songs':{
          '$elemMatch':{'song_id':ObjectId(self.idsong)}
          }
        }
      ]}))

      if(song[0]):
        return jsonify({'status':False, 'message':'Song already Exist'})

      #1.- Get the array "songs" from MongoDB
      for data in self.cPlaylist.find({'_id':ObjectId(self.idPlaylist)}):
        songs = data['songs']
      
      #2.- Get each song ID from the array "songs" 
      for data in songs:
        if(data != ''):
          currentSongs.append(data)

      #3.- Add an object with the new song to "currentSongs"
      currentSongs.append({
        'song_id':ObjectId(self.idsong)
      })

      self.cPlaylist.find_one_and_update({'_id':ObjectId(self.idPlaylist)}, 
      {'$set':{
        'songs':currentSongs
      }})

      return jsonify({'status':True, 'message':'Song added to the Playlist'})
    except:
      return jsonify({'status':False, 'message':'Error to added the song try later'})

  

  def get_favorites(self):
    try:
      favorites = []
      data = self.cPlaylist.find_one({'$and':[
        {
          'user_id':ObjectId(self.iduser)
        },
        {
          'name':'Favorites'
        }
      ]})

      #This is to create an array but with the song ids, is like the .map() in JS
      song_ids = [s['song_id'] for s in data['songs']]

      ''' 
        Other way to do this, is with a for:

        song_ids = []
        for s in data['songs']:
          song_ids.append(s['song_id'])
      '''

      songs = self.cSongs.aggregate([
        {'$match': {'_id':{'$in':song_ids}}},
        {'$addFields':{'_id':{'$toString':'$_id'}}}
      ])

      data['songs'] = list(songs)

      favorites.append({
        '_id':str(ObjectId(data['_id'])),
        'user_id':str(ObjectId(data['user_id'])),
        'name':data['name'],
        'background':data['background'],
        'created':data['created'],
        'createdBy':data['createdBy'],
        'songs':data['songs'],
        'visibility':data['visibility']
      })

      return jsonify({'status':True, 'results':favorites})
    except Exception as e:
      return jsonify({'status':False, 'message':'Error to get the favorite songs', 'err':e})
