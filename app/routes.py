from flask import render_template
from app import app

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