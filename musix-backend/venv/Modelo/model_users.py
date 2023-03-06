from Modelo.conexion import Conexion

from flask_pymongo import PyMongo, ObjectId
from flask import jsonify, request

import json
from botocore.exceptions import ClientError


import boto3
import os

from werkzeug.utils import secure_filename

class ModelUsers():

  db = Conexion.connect()
  cUsers = db.users
  cAccount = db.accounts

  id=""
  urlImage = None
  nameImage = 'avatar.jpg'

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
    s3 = boto3.client('s3',
      endpoint_url = 'https://s3.filebase.com',
      aws_access_key_id = "B0E0B15155B64920B741",
      aws_secret_access_key = "cqpvswtXeN5Eit3iZQmEaQtga5Nc1vY3qk5N0kiA"
    )

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