from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS

from config.routes import blueprint

app = Flask(__name__)

app.config['MONGO_URI']='mongodb://localhost/musix'
mongo = PyMongo(app)

db = mongo.db.users


app.register_blueprint(blueprint)
CORS(app)

if __name__ == "__main__":
  app.run(host='0.0.0.0', port=5000)