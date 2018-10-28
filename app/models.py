from app import app

class User():
    userID = ""

    def setUserID(newID):
        userID = newID

    def isLoggedIn():
        if (userID != ""):
            return True
        else:
            return False

