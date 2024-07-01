
from flask import Flask
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    CORS(app)

    from app.scrape.routes import bp as scrape_bp

    app.register_blueprint(scrape_bp, url_prefix="/scrape")

    return app
