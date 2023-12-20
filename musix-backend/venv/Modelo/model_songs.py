from Services.mongoDB import Conexion
from Modelo.model_playlist import ModelPlaylist

from flask_pymongo import ObjectId
from flask import jsonify, request

import json
import re
import os
from botocore.exceptions import ClientError
from werkzeug.utils import secure_filename
import uuid


class 	ModelSongs():
  db = Conexion.connect()
  Mod_playlist = ModelPlaylist()

  #This are my collections
  cSongs = db.songs
  cProfile = db.profile
  cPlaylist = db.playlist


  artist = ''
  idUser = ''
  idSong = ''
  search_term = ''
  urlImage = ''

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
        'date':request.json['date'],
        'lyrics':request.json['lyrics']
      })

    return jsonify({'status':True, 'message':'Songs Added'})

  def get_song(self):

    song = self.cSongs.find_one({'_id': ObjectId(self.idSong)})

    #Obtain the favorites songs
    self.Mod_playlist.iduser = self.idUser
    favorites_playlist = (json.loads(self.Mod_playlist.get_favorites().get_data(as_text=True)))['results'][0]
    favorite_song_ids = [ObjectId(s['_id']) for s in favorites_playlist['songs']]

    #Verify if the current song is a favorite song
    if song['_id'] in favorite_song_ids:
      song['favorite'] = True #Add a attribute called favorite with True if is a favorite song
    else:
      song['favorite'] = False #Add a attribute called favorite with False if isn't a favorite song

    return jsonify({'status':True, 'message':'Song Found', 
      'data': {
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
      }
    })

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
        'date':data['date'],
        'lyrics':data['lyrics']
      })

    return jsonify(songs)

  def get_recent_songs(self):
    songs = []

    #Obtain the favorites songs
    self.Mod_playlist.iduser = self.idUser
    favorites_playlist = (json.loads(self.Mod_playlist.get_favorites().get_data(as_text=True)))['results'][0]
    favorite_song_ids = [ObjectId(s['_id']) for s in favorites_playlist['songs']]

    #for data in self.cSongs.find({'date':dateutil.parser.parse(self.date)}):
    for data in self.cSongs.find().sort("_id", -1).limit(8):
      #Verify if the current song is a favorite song
      if data['_id'] in favorite_song_ids:
        data['favorite'] = True #Add a attribute called favorite with True if is a favorite song
      else:
        data['favorite'] = False #Add a attribute called favorite with False if isn't a favorite song

      songs.append({
        '_id':str(ObjectId(data['_id'])),
        'name':data['name'],
        'album':data['album'],
        'artist':data['artist'],
        'genre':data['genre'],
        'cover':data['cover'],
        'duration':data['duration'],
        'url':data['url'],
        'date':data['date'],
        'lyrics':data['lyrics'],
        'favorite':data['favorite']
      })


    return jsonify(songs)

  def get_songsByArtist(self):
    songs = []

    #Obtain the favorites songs
    self.Mod_playlist.iduser = self.idUser
    favorites_playlist = (json.loads(self.Mod_playlist.get_favorites().get_data(as_text=True)))['results'][0]
    favorite_song_ids = [ObjectId(s['_id']) for s in favorites_playlist['songs']]

    for data in self.cSongs.find({'artist':self.artist}):

      #Verify if the current song is a favorite song
      if data['_id'] in favorite_song_ids:
        data['favorite'] = True #Add a attribute called favorite with True if is a favorite song
      else:
        data['favorite'] = False #Add a attribute called favorite with False if isn't a favorite song

      songs.append({
        '_id':str(ObjectId(data['_id'])),
        'name':data['name'],
        'album':data['album'],
        'artist':data['artist'],
        'genre':data['genre'],
        'cover':data['cover'],
        'duration':data['duration'],
        'url':data['url'],
        'date':data['date'],
        'lyrics':data['lyrics'],
        'favorite':data['favorite']
      })

    return jsonify(songs)

  def get_recommended_songs(self):

    userprofile = self.cProfile.find_one({'user_id':ObjectId(self.idUser)})
    if(not userprofile):
      return jsonify({'status':False, 'message':"There aren't a likes songs yet"})

    songs = []

    #Obtain the favorites songs
    self.Mod_playlist.iduser = self.idUser
    favorites_playlist = (json.loads(self.Mod_playlist.get_favorites().get_data(as_text=True)))['results'][0]
    favorite_song_ids = [ObjectId(s['_id']) for s in favorites_playlist['songs']]

    for data in self.cSongs.find({'genre':userprofile['favorite_genre']}):
      #Verify if the current song is a favorite song
      if data['_id'] in favorite_song_ids:
        data['favorite'] = True #Add a attribute called favorite with True if is a favorite song
      else:
        data['favorite'] = False #Add a attribute called favorite with False if isn't a favorite song

      songs.append({
        '_id':str(ObjectId(data['_id'])),
        'name':data['name'],
        'album':data['album'],
        'artist':data['artist'],
        'genre':data['genre'],
        'cover':data['cover'],
        'duration':data['duration'],
        'url':data['url'],
        'date':data['date'],
        'lyrics':data['lyrics'],
        'favorite':data['favorite']
      })

    return jsonify(songs)

  def get_my_likes(self):
    userprofile = self.cProfile.find_one({'user_id':ObjectId(self.idUser)})

    if(not userprofile): 
      return jsonify({'status':False, 'message':"There aren't a likes songs yet"})
    else:
      songs = []

      #Obtain the favorites songs
      self.Mod_playlist.iduser = self.idUser
      favorites_playlist = (json.loads(self.Mod_playlist.get_favorites().get_data(as_text=True)))['results'][0]
      favorite_song_ids = [ObjectId(s['_id']) for s in favorites_playlist['songs']]


      for data in self.cSongs.find({'artist':userprofile['favorite_artist']}):
        #Verify if the current song is a favorite song
        if data['_id'] in favorite_song_ids:
          data['favorite'] = True #Add a attribute called favorite with True if is a favorite song
        else:
          data['favorite'] = False #Add a attribute called favorite with False if isn't a favorite song

        songs.append({
          '_id':str(ObjectId(data['_id'])),
          'name':data['name'],
          'album':data['album'],
          'artist':data['artist'],
          'genre':data['genre'],
          'cover':data['cover'],
          'duration':data['duration'],
          'url':data['url'],
          'date':data['date'],
          'lyrics':data['lyrics'],
          'favorite':data['favorite']
        })

      return jsonify(songs)

  def search_songs(self):
    try:      

      regex = re.compile(self.search_term, re.IGNORECASE)
      songs = self.cSongs.find({
        '$or':[
          {'name':regex},
          {'artist': regex},
          {'album':regex}
        ]
      })

      #Get the user's favorite songs to see if the song found is a favorite song 
      self.Mod_playlist.iduser = self.idUser
      favoritesSongsId = self.Mod_playlist.get_favorites(True)

      results = list(songs)
      for result in results:
        result['_id'] = str(result['_id'])
        result['favorite'] = ObjectId(result['_id']) in favoritesSongsId #Chech if the songs found are in 'favoritesSongsId' List


      return jsonify({'data':results})
    except Exception as e:
      print('Error to find the Song: ', e)
      return jsonify({'status':False, 'message':'Error to find the Song'})
    

  def upload_image(self):
    try:
      #Upload Imagen to this flask server
      file = request.files['file']
      Path = os.path.join(os.path.dirname(__file__))    
      UPLOAD_FOLDER = os.path.join(os.path.dirname(Path), 'images')

      filename = secure_filename(file.filename)
      extension = os.path.splitext(filename)[1]

      newName = str(uuid.uuid4()) + extension

      upload_path = os.path.join(UPLOAD_FOLDER, newName)
      
      file.save(upload_path)
      self.upload_to_filebase(newName)

      return jsonify({'status':True, 'message':'Image uploaded to the Flask Server', 'url':self.urlImage})
    except ClientError as e:
      print('error: %s') % e
      return jsonify({'status':False, 'message':'Error to upload the image to the Flask Server'})

  
    


  def upload_to_filebase(self, nameImage):
    CDI = None
    #Auth to my account of Filebase
    from Services.fileBase import s3;
    from decouple import config

    image = nameImage
    #To upload a new object to the Bucket in this case an imagen 
    currentPath = os.path.join(os.path.dirname(__file__))    
    pathImage = os.path.join(os.path.dirname(currentPath), 'images', image)

    with open(pathImage, 'rb') as data:
      try:    

        #Insert object to the Bucket
        request = s3.put_object(
          Body=data,
          Bucket= config('BUCKET_NAME'),
          Key = config('IMAGES_FOLDER_1') + '/' + nameImage, 
          ContentType = 'imagen/jpeg'
        )

        CDI = request['ResponseMetadata']['HTTPHeaders']['x-amz-meta-cid']

        #Stored the URL Imagen after it uploaded to https://filebase.com/
        self.urlImage = 'https://ipfs.filebase.io/ipfs/' + CDI

      except ClientError as e:
        print('error: %s') % e
        return 'error'