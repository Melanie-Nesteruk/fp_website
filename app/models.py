from app import app

class User():
    userID = ""

    def setUserID(newID):
        userID = newID

    def isLoggedIn():
        if (userID not ""):
            return True
        else:
            return False

