from Modelo.model_users import ModelUsers;
from Modelo.model_songs import ModelSongs

mUsers = ModelUsers()
mSongs = ModelSongs()

def create_users():
  return mUsers.create_user()

def upload_file():
  return mUsers.uploadFile()

def update_profile():
  return mUsers.update_profile()

def auth_user():
  return mUsers.auth_user()


def find_user(id):
  mUsers.id = id
  return mUsers.find_user()

def find_account(id):
  mUsers.id = id
  return mUsers.find_account()


def add_song():
  return mSongs.add_song()

def get_songs():
  return mSongs.get_songs()

def get_recent_songs(iduser):
  mSongs.idUser = iduser
  return mSongs.get_recent_songs()

def get_songsByArtist(artist, iduser):
  mSongs.artist = artist
  mSongs.idUser = iduser
  return mSongs.get_songsByArtist()