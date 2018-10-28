from flask import render_template, request
from app.models import User
from app import app
import json
import sys

@app.route('/')
@app.route('/index')
def index():
    return render_template("index.html", title='Home', app=app, loggedIn=User.isLoggedIn(User))

@app.route('/login')
def login():
    return render_template("login.html", title='Login', app=app, loggedIn=User.isLoggedIn(User), user=User)

@app.route('/register')
def register():
    return render_template("register.html", title='Register', app=app, loggedIn=User.isLoggedIn(User))

@app.route('/about')
def about():
    return render_template("about.html", title='About', app=app, loggedIn=User.isLoggedIn(User))

@app.route('/work')
def products():
    return render_template("work.html", title='Work', app=app, loggedIn=User.isLoggedIn(User))

@app.route('/events')
def store():
    return render_template("events.html", title='Events', app=app, loggedIn=User.isLoggedIn(User))

@app.route('/subscribe')
def subscribe():
    return render_template("subscribe.html", title='Subscribe', app=app, loggedIn=User.isLoggedIn(User))

@app.route('/directory')
def directory():
    return render_template("directory.html", title='Directory', app=app, loggedIn=User.isLoggedIn(User))

@app.route('/profile')
def profile():
    return render_template("profile.html", title='Profile', app=app, loggedIn=User.isLoggedIn(User))

@app.route('/messages')
def messages():
    return render_template("messages.html", title='Messages', app=app, loggedIn=User.isLoggedIn(User))

@app.route('/jsLogin', methods = ['POST'])
def jsLogin():
    User.setState(User, True)
    return 

@app.route('/jslogout', methods = ['POST'])
def jsLogout():
    User.setState(User, False)