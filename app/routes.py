from flask import render_template
from app import app
from app.models import User

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

@app.route('/subscribe')
def subscribe():
    return render_template("subscribe.html", title='Subscribe', app=app)

@app.route('/directory')
@login_required()
def directory():
    return render_template("directory.html", title='Directory', app=app)

@app.route('/profile')
@login_required()
def profile():
    return render_template("profile.html", title='Profile', app=app)

@app.route('/messages')
@login_required()
def messages():
    return render_template("messages.html", title='Messages', app=app)

def login_required():
    if (User.isLoggedIn()):
        return True
    else:
        login()
