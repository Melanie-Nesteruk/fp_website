from app import app

class User():
    userID = ""

    def setUserID(self, newID):
        userID = newID

    def isLoggedIn(self):
        if (userID != ""):
            return True
        else:
            return False

