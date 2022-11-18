from Modelo.model_playlist import ModelPlaylist

mPlaylist = ModelPlaylist()

def add_favorite(idsong, iduser, date):
  mPlaylist.idsong = idsong
  mPlaylist.iduser = iduser
  mPlaylist.date = date
  return mPlaylist.add_favorite()

def get_playlists(iduser):
  mPlaylist.iduser = iduser
  return mPlaylist.get_playlists()


def get_song_playlists(idsong):
  mPlaylist.idsong = idsong
  
  return mPlaylist.get_song_playlists()