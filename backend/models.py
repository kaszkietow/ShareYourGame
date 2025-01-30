from app import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)
    img_url = db.Column(db.String(200), nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    cars = db.relationship('Car', backref='owner', lazy=True)
    reservations = db.relationship('Reservation', backref='user', lazy=True) # Relacja z rezerwacjami

    def to_json_user(self):
        return {
            "id": self.id,
            "username": self.username,
            "imgUrl": self.img_url,
            "gender": self.gender,
            "cars": [car.to_json_car() for car in self.cars],
            "reservations": [reservation.to_json_reservation() for reservation in self.reservations],
        }

class Car(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    model = db.Column(db.String(80), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    available = db.Column(db.String(10), nullable=False)
    img_url = db.Column(db.String(200), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    reservations = db.relationship('Reservation', backref='car', lazy=True) # Relacja z rezerwacjami

    def to_json_car_with_owner(self):
        return {
            "id": self.id,
            "model": self.model,
            "description": self.description,
            "available": self.available,
            "imgUrl": self.img_url,
            "price": self.price,
            "owner": {
                "id": self.owner_id,
                "username": self.owner.username,
                "imgUrl": self.owner.img_url,
            },
            "reservations": [reservation.to_json_reservation() for reservation in self.reservations],
        }

    def to_json_car(self):
        return {
            "id": self.id,
            "model": self.model,
            "description": self.description,
            "available": self.available,
            "imgUrl": self.img_url,
            "price": self.price,
        }

class Reservation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    car_id = db.Column(db.Integer, db.ForeignKey('car.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    reservation_date = db.Column(db.DateTime, nullable=False)
    return_date = db.Column(db.DateTime, nullable=False)
    payment = db.relationship('Payment', backref='reservation', lazy=True) # Relacja z płatnościami

    def to_json_reservation(self):
        return {
            "id": self.id,
            "car_id": self.car_id,
            "user_id": self.user_id,
            "reservation_date": self.reservation_date,
            "return_date": self.return_date,
            "payment": [payment.to_json_payment() for payment in self.payment],
        }

class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    reservation_id = db.Column(db.Integer, db.ForeignKey('reservation.id'), nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), nullable=False)

    def to_json_payment(self):
        return {
            "id": self.id,
            "reservation_id": self.reservation_id,
            "amount": self.amount,
            "status": self.status,
        }
