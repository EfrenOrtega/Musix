from Modelo.model_songs import ModelSongs

mSongs = ModelSongs()

def get_recommended_songs(iduser):
  mSongs.idUser = iduser
  return mSongs.get_recommended_songs()

def get_my_likes(iduser):
  mSongs.idUser = iduser
  return mSongs.get_my_likes()