#! /usr/bin/env python3

import sys
import json

from app import app
from flask import render_template, request

@app.route('/')
@app.route('/index')
def index():
    return render_template("index.html", title='Home', app=app)


@app.route('/login')
def login():
    return render_template("login.html", title='Login', app=app)


@app.route('/register')
def register():
    return render_template("register.html", title='Register', app=app)


@app.route('/about')
def about():
    return render_template("about.html", title='About', app=app)


@app.route('/work')
def products():
    return render_template("work.html", title='Work', app=app)


@app.route('/events')
def store():
    return render_template("events.html", title='Events', app=app)


@app.route('/socialmedia')
def socialMedia():
    return render_template("socialmedia.html", title='Social Media', app=app)


@app.route('/subscribe')
def subscribe():
    return render_template("subscribe.html", title='Subscribe', app=app)


@app.route('/directory')
def directory():
    return render_template("directory.html", title='Directory', app=app)

@app.route('/profile')
def profile():
    user = request.args.get('user', '')
    edit = request.args.get('edit', '')

    if (user):
        return render_template("profile.html", title='Profile', app=app, user=user)
    elif (edit == "true"):
        return render_template("profile.html", title='Profile', app=app, editmode=True)
    else:
        return render_template("profile.html", title='Profile', app=app)

@app.route('/messages')
def messages():
    return render_template("messages.html", title='Messages', app=app)

@app.route('/messenger')
def messenger():
	sid = request.args.get('sid', '')
	if (sid):
		return render_template("messenger.html", title='Messenger', app=app, sid=sid)
	else:
		return render_template("messenger.html", title='Messenger', app=app)


@app.route('/reset')
def reset():
    return render_template("reset.html", title='Reset', app=app)