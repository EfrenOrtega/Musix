from Modelo.model_playlist import ModelPlaylist

mPlaylist = ModelPlaylist()

def add_favorite(idsong, iduser, date):
  mPlaylist.idsong = idsong
  mPlaylist.iduser = iduser
  mPlaylist.date = date
  return mPlaylist.add_favorite()
