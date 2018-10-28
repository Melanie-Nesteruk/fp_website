from flask import render_template, request
from app.models import User
from app import app
import json
import sys

userInstance = User()

@app.route('/')
@app.route('/index')
def index():
    return render_template("index.html", title='Home', app=app, loggedIn=userInstance.isLoggedIn(userInstance), userInstance=userInstance)

@app.route('/login')
def login():
    return render_template("login.html", title='Login', app=app, loggedIn=userInstance.isLoggedIn(userInstance), userInstance=userInstance)

@app.route('/register')
def register():
    return render_template("register.html", title='Register', app=app, loggedIn=userInstance.isLoggedIn(userInstance), userInstance=userInstance)

@app.route('/about')
def about():
    return render_template("about.html", title='About', app=app, loggedIn=userInstance.isLoggedIn(userInstance))

@app.route('/work')
def products():
    return render_template("work.html", title='Work', app=app, loggedIn=userInstance.isLoggedIn(userInstance))

@app.route('/events')
def store():
    return render_template("events.html", title='Events', app=app, loggedIn=userInstance.isLoggedIn(userInstance))

@app.route('/subscribe')
def subscribe():
    return render_template("subscribe.html", title='Subscribe', app=app, loggedIn=userInstance.isLoggedIn(userInstance))

@app.route('/directory')
def directory():
    return render_template("directory.html", title='Directory', app=app, loggedIn=userInstance.isLoggedIn(userInstance))

@app.route('/profile')
def profile():
    return render_template("profile.html", title='Profile', app=app, loggedIn=userInstance.isLoggedIn(userInstance))

@app.route('/messages')
def messages():
    return render_template("messages.html", title='Messages', app=app, loggedIn=userInstance.isLoggedIn(userInstance))

@app.route('/jsLogin', methods = ['POST'])
def jsLogin():
    #userInstance = request.get_json()
    userInstance.setState(userInstance, True)
    return 

@app.route('/jslogout', methods = ['POST'])
def jsLogout():
    #userInstance = request.get_json()
    userInstance.setState(userInstance, False)