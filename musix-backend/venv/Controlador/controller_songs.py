from Modelo.model_songs import ModelSongs

mSongs = ModelSongs()

def get_recommended_songs(iduser):
  mSongs.idUser = iduser
  return mSongs.get_recommended_songs()

def get_song(idsong, iduser):
  mSongs.idSong = idsong
  mSongs.idUser = iduser
  return mSongs.get_song()

def get_my_likes(iduser):
  mSongs.idUser = iduser
  return mSongs.get_my_likes()

def search_songs(search):
  mSongs.search_term = search
  return mSongs.search_songs()