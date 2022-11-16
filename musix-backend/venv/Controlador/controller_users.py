from Modelo.model_users import ModelUsers;

mUsers = ModelUsers()

def create_users():
  return mUsers.create_user()

def upload_file():
  return mUsers.uploadFile()

def auth_user():
  return mUsers.auth_user()