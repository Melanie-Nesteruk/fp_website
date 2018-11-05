#! /usr/bin/env python3

import sys
import json

from app import app
from app.models import User
from flask import render_template, request


userInstance = User()
initializeUser()


@app.route('/')
@app.route('/index')
def index():
    return render_template("index.html", title='Home', app=app, loggedIn=userInstance.getLoginState(), userInstance=userInstance)


@app.route('/login')
def login():
    return render_template("login.html", title='Login', app=app, loggedIn=userInstance.getLoginState(), userInstance=userInstance)


@app.route('/register')
def register():
    return render_template("register.html", title='Register', app=app, loggedIn=userInstance.getLoginState(), userInstance=userInstance)


@app.route('/about')
def about():
    return render_template("about.html", title='About', app=app, loggedIn=userInstance.getLoginState())


@app.route('/work')
def products():
    return render_template("work.html", title='Work', app=app, loggedIn=userInstance.getLoginState())


@app.route('/events')
def store():
    return render_template("events.html", title='Events', app=app, loggedIn=userInstance.getLoginState())


@app.route('/socialmedia')
def socialMedia():
    return render_template("socialmedia.html", title='Social Media', app=app, loggedIn=userInstance.getLoginState())


@app.route('/subscribe')
def subscribe():
    return render_template("subscribe.html", title='Subscribe', app=app, loggedIn=userInstance.getLoginState())


@app.route('/directory')
def directory():
    return render_template("directory.html", title='Directory', app=app, loggedIn=userInstance.getLoginState())


@app.route('/profile')
def profile():
    return render_template("profile.html", title='Profile', app=app, loggedIn=userInstance.getLoginState())


@app.route('/messages')
def messages():
    return render_template("messages.html", title='Messages', app=app, loggedIn=userInstance.getLoginState())


@app.route('/reset')
def reset():
    return render_template("reset.html", title='Reset', app=app, loggedIn=userInstance.getLoginState(), userInstance=userInstance)


@app.route('/jsLogin', methods = ['POST'])
def jsLogin():
    userInstance.setLoginState(True)


@app.route('/jslogout', methods = ['POST'])
def jsLogout():
    userInstance.setLoginState(False)


def initializeUser():
    render_template("navigation_authentication.html")
