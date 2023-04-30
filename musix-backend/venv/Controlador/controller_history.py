from Modelo.model_history import ModelHistory

mHistory = ModelHistory()

def updateHistory():
  return mHistory.updateHistory()

def getHistory(limit, iduser):
  mHistory.limitItems = limit
  mHistory.idUser = iduser
  return mHistory.getHistory()