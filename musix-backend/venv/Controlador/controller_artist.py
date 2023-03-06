from Modelo.modelo_artist import ModelArtist

mArtist = ModelArtist()

def insert_artist():
  return mArtist.insertArtist()

def get_artists():
  return mArtist.getArtists()


def get_artist(idartist):
  mArtist.idartist = idartist
  return mArtist.getArtist()