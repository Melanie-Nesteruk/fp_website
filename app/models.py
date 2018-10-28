from app import app

class User():
    userID = ""

    def setUserID(self, newID):
        self.userID = newID

    def isLoggedIn(self):
        if (self.userID != ""):
            return True
        else:
            return False

