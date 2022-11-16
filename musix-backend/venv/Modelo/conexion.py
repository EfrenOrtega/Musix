#MONGODB
import pymongo


class Conexion():
  def __init__(self):
    pass

  def connect():
    db_name = "musix"
    db_URI = "mongodb://localhost/"

    client = pymongo.MongoClient(db_URI + db_name)
    mdb = client[db_name]
    return mdb