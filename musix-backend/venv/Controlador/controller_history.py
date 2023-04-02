from Modelo.model_history import ModelHistory

mHistory = ModelHistory()

def updateHistory():
  return mHistory.updateHistory()

def getHistory(limit):
  mHistory.limitItems = limit
  return mHistory.getHistory()