from Services.mongoDB import Conexion

from flask_pymongo import ObjectId
from flask import jsonify, request

import json
from botocore.exceptions import ClientError

import os

from werkzeug.utils import secure_filename

import uuid


class ModelUsers():

  db = Conexion.connect()
  cUsers = db.users
  cAccount = db.accounts

  id=""
  urlImage = None
  nameImage = 'avatar.jpg'
  imageFile = None

  def __init__(self):
    pass


  #===================================
  #           Create User
  #===================================
  def create_user(self):
    userStatus = self.cAccount.find_one({'username':request.json['username']})
    if(userStatus):
      return jsonify(({'status':False, 'message':'The user already exist'}))
    
    data = json.loads(json.dumps(request.json))
    
    if(data.get('name') and data.get('last') and data.get('email') and data.get('password') and data.get('age') and self.nameImage):

      self.upload_to_filebase()

      res = self.cUsers.insert_one({
        'name':request.json['name'],
        'last':request.json['last'],
        'email':request.json['email'],
        'password':request.json['password'],
        'age':request.json['age'],
        'avatar':self.urlImage,#Here stores the url imagen that return upload_to_filebase()   
      })

      self.id = str(res.inserted_id)
      return self.create_account()

    else:
      return jsonify({'status':False, 'message':'Error to Connect to the DB or the data is incomplete'})

  def create_account(self):

    res = self.cAccount.insert_one({
      'username':request.json['username'],
      'password':request.json['password'],
      'user_id':self.id
    })
  
    return jsonify({'status':True, 'id_account':str(res.inserted_id), 'id_user':self.id})


  #=======================================
  #   Upload Image to the Flask Server
  #=======================================
  def uploadFile(self):
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

      self.nameImage = newName
    
      return jsonify({'status':True, 'message':'Image uploaded to the Flask Server'})
    except ClientError as e:
      print('error: %s') % e
      return jsonify({'status':False, 'message':'Error to upload the image to the Flask Server'})    



  def upload_to_filebase(self):
    CDI = None
    #Auth to my account of Filebase
    from Services.fileBase import s3;
    image = self.nameImage
    #To upload a new object to the Bucket in this case an imagen 
    currentPath = os.path.join(os.path.dirname(__file__))    
    pathImage = os.path.join(os.path.dirname(currentPath), 'images', image)

    with open(pathImage, 'rb') as data:
      try:    

        #Insert objecto to the Bucket "musix-3066"
        request = s3.put_object(
          Body=data,
          Bucket="musix-3066",
          Key = 'user_avatar/'+self.nameImage, 
          ContentType = 'imagen/jpeg'
        )

        CDI = request['ResponseMetadata']['HTTPHeaders']['x-amz-meta-cid']

        #Stored the URL Imagen after it uploaded to https://filebase.com/
        self.urlImage = 'https://ipfs.filebase.io/ipfs/' + CDI

      except ClientError as e:
        print('error: %s') % e
        return 'error'

  #==================================
  #       User Authentication
  #==================================
  def auth_user(self):
    user = self.cAccount.find_one({'username':request.json['username']})

    if(user):
      userData = self.cUsers.find_one({'_id':ObjectId(str(user['user_id']))})

      if(user['password'] == request.json['password']):
        return jsonify({'status':'true', 'msg':'Auth', 'idUser':str(userData['_id'])}) 

    return jsonify({'status':False, 'message':'User or Password Incorrect'})
  

  def find_user(self):
    user = self.cUsers.find_one({'_id': ObjectId(self.id)})
    return jsonify({'status':True, 'message':'User Found', 
      'data': {
        '_id':str(ObjectId(user['_id'])),
        'name':user['name'],
        'last':user['last'],
        'email':user['email'],
        'age':user['age'],
        'avatar':user['avatar']
      }
    })

  def find_account(self):
    account = self.cAccount.find_one({'user_id': self.id})
    return jsonify({'status':True, 'message':'Account Found', 
      'data': {
        '_id':str(ObjectId(account['_id'])),
        'username':account['username'],
        'password':account['password'],
      }
    })  

  def upload_file(self):
    try:
      #To upload an Imagen to this Flask server
      file = self.imageFile
      Path = os.path.join(os.path.dirname(__file__))    
      UPLOAD_FOLDER = os.path.join(os.path.dirname(Path), 'images')

      filename = secure_filename(file.filename)
      extension = os.path.splitext(filename)[1]

      newName = str(uuid.uuid4()) + extension

      upload_path = os.path.join(UPLOAD_FOLDER, newName)
      
      file.save(upload_path)

      self.nameImage = newName
    
      return jsonify({'status':True, 'message':'Imagen Uploaded'})
    except ClientError as e:
      print('error: %s') % e
      return jsonify({'status':False, 'message':'Error to Upload the Image'})

  def update_profile(self):
    jsonData = json.load(request.files['Form'])   

    try:
      if(request.files['File']):
        self.imageFile = request.files['File']
        self.upload_file()
        self.upload_to_filebase()
        print("This is the Url Image", self.urlImage)

        self.cUsers.update_one({'_id': ObjectId(jsonData['idUser'])}, {'$set':{
          'name':jsonData['dataUser']['name'],
          'last':jsonData['dataUser']['last'],
          'email':jsonData['dataUser']['email'],
          'avatar':self.urlImage
        }})

        self.cAccount.update_one({'user_id': jsonData['idUser']}, {'$set':{
          'username':jsonData['dataAccount']['username']
        }})

        return jsonify({'msg':'Profile Updated', 'status':True})

    except Exception as e:
      print("Error", e)    

    return jsonify({'msg':'Error to update the profile', 'status':False})