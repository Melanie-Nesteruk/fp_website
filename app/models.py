from app import app

class User():
    userID = ""
    loginState = False

    def isLoggedIn(self):
        return self.loginState
    
    def setState(self, state):
        self.loginState = state

