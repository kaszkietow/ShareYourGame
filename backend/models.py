from app import db
from datetime import datetime, timedelta


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    img_url = db.Column(db.String(200), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    games = db.relationship('Game', backref='owner', lazy=True)
    rentals = db.relationship('Rental', backref='renter', lazy=True)
    payments = db.relationship('Payment', backref='payer', lazy=True)

    def to_json_user(self):
        return {
            "id": self.id,
            "username": self.username,
            "password": self.password,
            "gender": self.gender,
            "imgUrl": self.img_url,
            "location": self.location,
            "games": [game.to_json_game() for game in self.games],
            "rentals": [rental.to_json_rental() for rental in self.rentals],
        }


class Game(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    platform = db.Column(db.String(10), nullable=False)
    genre = db.Column(db.String(50), nullable=False)
    condition = db.Column(db.String(20), nullable=False)
    img_url = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price_per_day = db.Column(db.Float, nullable=False)
    available = db.Column(db.String(10), default=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    rentals = db.relationship('Rental', backref='game', lazy=True)

    def to_json_game(self):
        return {
            "id": self.id,
            "title": self.title,
            "platform": self.platform,
            "genre": self.genre,
            "condition": self.condition,
            "imgUrl": self.img_url,
            "description": self.description,
            "price_per_day": self.price_per_day,
            "available": self.available
        }

    def to_json_game_with_owner(self):
        return {
            **self.to_json_game(),
            "owner": {
                "id": self.owner.id,
                "username": self.owner.username,
                "imgUrl": self.owner.img_url,
            }
        }


class Rental(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    game_id = db.Column(db.Integer, db.ForeignKey('game.id'), nullable=False)
    renter_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    end_date = db.Column(db.DateTime, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default="pending")
    payment = db.relationship('Payment', backref='rental', lazy=True, uselist=False)

    def to_json_rental(self):
        return {
            "id": self.id,
            "game": self.game.to_json_game(),
            "renter": {
                "id": self.renter.id,
                "username": self.renter.username
            },
            "start_date": self.start_date,
            "end_date": self.end_date,
            "total_price": self.total_price,
            "status": self.status,
            "payment": self.payment.to_json_payment() if self.payment else None
        }


class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    rental_id = db.Column(db.Integer, db.ForeignKey('rental.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default="pending")  # pending, completed, failed
    payment_date = db.Column(db.DateTime, default=datetime.utcnow)

    def to_json_payment(self):
        return {
            "id": self.id,
            "rental_id": self.rental_id,
            "user_id": self.user_id,
            "amount": self.amount,
            "status": self.status,
            "payment_date": self.payment_date,
        }
