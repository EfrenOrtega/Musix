from pymongo import MongoClient

client = MongoClient('mongodb://localhost/')
db = client['musix']

mPlaylist = db.playlist
profile = db.profile
mSongs = db.songs

def getFavoritesOfUser():
  songs = []
  for data in mPlaylist.find():
    songs.append({
        'user_id':str(data['_id']),
        'name':data['name'],
        'background':data['background'],
        'created':data['created'],
        'createdBy':data['createdBy'],
        'songs':data['songs'],
        'visibility':data['visibility']
    })

  #print(songs)  

def getFavoritesSongs():
  users = []
  favorites = []
  userData = {}

  for data in profile.find():
    users.append({
      'user_id':data['user_id'],
      'playlists':data['playlists']
    })

  count = 0;

  for playlist in users:
    favoritesId = playlist['playlists'][0]['playlist_id']

    for data in mPlaylist.find({'_id':favoritesId}):
      favorites = [{
        '_id':data['_id'],
        'user_id' : data['user_id'],
        'name' : data['name'],
        'background' : data['background'],
        'created' : data['created'],
        'createdBy' : data['createdBy'],
        'songs' : data['songs'],
        'visibility' : data['visibility']
      }]

    songsArr = []

    for songs in favorites:
      #print(songs['songs'])
      for song in songs['songs']:
        songId = song['song_id']
        for data in mSongs.find({'_id':songId}):
          songsArr.append({
            '_id' : data['_id'],
            'name' : data['name'],
            'artist' : data['artist'],
            'album' : data['album'],
            'genre' : data['genre'],
            'cover' : data['cover'],
            'duration' : data['duration'],
            'url' : data['url'],
            'date' : data['date']
          })

          try:
            userData[users[count]['user_id']].append({
              'song':data['name'],
              'artist':data['artist'],
              'genre':data['genre']
            })
          except Exception as e:
            userData[users[count]['user_id']] = [{
              'song':data['name'],
              'artist':data['artist'],
              'genre':data['genre']
            }]
          
    count = count + 1

  return userData


def analyze():
  songs = getFavoritesSongs()

  currentUser = ''

  for userSong in songs:

    artists = {}
    genres = {}  
    favoriteArtist = '';
    favoriteGenre = ''

    for songData in songs[userSong]:
      try:
          artists[songData['artist']] = artists[songData['artist']] + 1
          genres[songData['genre']] = genres[songData['genre']] + 1 
      except Exception as e:
        artists[songData['artist']] = 0
        genres[songData['genre']] = 0

      positionArtist = list(artists.values()).index(max(artists.values()))
      positionGenre = list(genres.values()).index(max(genres.values()))
      favoriteArtist = list(artists.keys())[positionArtist]
      favoriteGenre = list(genres.keys())[positionGenre]

    updateData(favoriteArtist, favoriteGenre, userSong)

def updateData(favoriteArtist, favoriteGenre, userSong):
  
  profile.update_many({'user_id':userSong}, {"$set":{
    'favorite_artist' : favoriteArtist,
    'favorite_genre' : favoriteGenre
  }})

analyze()