import datetime
from app import app, db
from flask import request, jsonify, Flask, redirect, send_from_directory
from models import Car, User, Reservation
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt
from flask_swagger_ui import get_swaggerui_blueprint
from datetime import datetime
import threading
from zoneinfo import ZoneInfo
from threading import Timer
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError


app.config['JWT_SECRET_KEY'] = 'A6BF4B5839CA8C4F7872DE2F854BE'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 3600
jwt = JWTManager(app)
app.config["JWT_VERIFY_SUB"] = False

@app.route("/api/cars", methods=["GET"])
@jwt_required()
def get_cars():
    try:
        cars = Car.query.all()
        cars_json = [car.to_json_car_with_owner() for car in cars]
        return jsonify(cars_json), 200
    except Exception as e:
        print(f"Error fetching cars: {e}")
        return jsonify({"error": "Internal Server Error"}), 500


# Add new card
@app.route("/api/cars", methods=["POST"])
@jwt_required()
def create_car():
    try:
        data = request.json
        print(f"Received data: {data}")
        required_fields = ["model", "description", "available", "img_url", "price"]
        for field in required_fields:
            if field not in data or not data.get(field):
                return jsonify({"error": f"Missing required field: {field}"}), 400

        id = data.get("id")
        model = data.get("model")
        description = data.get("description")
        available = data.get("available")
        img_url = data.get("img_url")
        price = data.get("price")
        owner_id = data.get("owner_id")

        new_car = Car(
            id=id, model=model, description=description,
            available=available, img_url=img_url, price=price, owner_id=owner_id
        )
        db.session.add(new_car)
        db.session.commit()
        return jsonify(new_car.to_json_car_with_owner()), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500


# Delete car
@app.route("/api/cars/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_car(id):
    try:
        car = Car.query.get(id)
        if car is None:
            return jsonify({"error": "Car doen't exist"}), 404
        db.session.delete(car)
        db.session.commit()
        return jsonify({"message": "Car deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@app.route("/api/cars/<int:id>", methods=["PATCH"])
@jwt_required()
def update_car(id):
    try:
        car = Car.query.get(id)
        if car is None:
            return jsonify({"error": "Car not found"}), 404

        data = request.json

        car.model = data.get("model", car.model)
        car.description = data.get("description", car.description)
        car.available = data.get("available", car.available)
        car.img_url = data.get("img_url", car.img_url)
        car.price = data.get("price", car.price)

        db.session.commit()
        return jsonify(car.to_json_car_with_owner()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@app.route("/api/users", methods=["GET"])
# @jwt_required()
def get_users():
    users = User.query.all()
    result = [user.to_json_user() for user in users]
    return jsonify(result)


@app.route("/api/register", methods=["POST"])
def register_user():
    try:
        data = request.get_json()

        required_fields = ["username", "password", "gender"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        username = data.get("username")
        password = data.get("password")
        gender = data.get("gender")

        if not username or len(username.strip()) < 3:
            return jsonify({"error": "Username must be at least 3 characters long"}), 400

        if not password or len(password) < 6:
            return jsonify({"error": "Password must be at least 6 characters long"}), 400

        if gender not in ["male", "female"]:
            return jsonify({"error": "Gender must be either 'male' or 'female'"}), 400

        if User.query.filter_by(username=username).first():
            return jsonify({"error": "Username already exists"}), 400

        if gender == "male":
            img_url = f"https://avatar.iran.liara.run/public/boy?username={username}"
        else:
            img_url = f"https://avatar.iran.liara.run/public/girl?username={username}"

        new_user = User(username=username, password=password, gender=gender, img_url=img_url)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500



@app.route("/api/users/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_user(id):
    try:
        user = User.query.get(id)
        if user is None:
            return jsonify({"error": "User doesn't exist"}), 404
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@app.route("/api/users/<int:id>", methods=["PATCH"])
@jwt_required()
def update_user(id):
    try:
        user = User.query.get(id)
        if user is None:
            return jsonify({"error": "User not found"}), 404

        data = request.json

        user.username = data.get("username", user.username)
        user.password = data.get("password", user.password)
        user.img_url = data.get("img_url", user.img_url)

        db.session.commit()
        return jsonify(user.to_json_user()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@app.route("/login", methods=["POST"])
def login_user():
    try:
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        user = User.query.filter_by(username=username).first()

        if user and user.password == password:
            access_token = create_access_token(identity={"id": user.id, "username": user.username})

            return jsonify({"access_token": access_token}), 200

        return jsonify({"error": "Invalid username or password."}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500


blacklist = set()


@app.route("/logout", methods=["POST"])
@jwt_required()
def logout_user():
    jti = get_jwt()["jti"]
    blacklist.add(jti)
    return jsonify({"message": "Logged out successfully"}), 200


@jwt.token_in_blocklist_loader
def check_if_token_is_revoked(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    return jti in blacklist


@app.route("/current_user", methods=["GET"])
@jwt_required()
def get_current_user():
    try:
        user_identity = get_jwt_identity()
        user_id = user_identity["id"]

        user = User.query.get(user_id)

        if not user:
            return jsonify({"error": "User not found"}), 404

        user_json = user.to_json_user()
        return jsonify(user_json), 200
    except Exception as e:
        print(f"Error fetching currentUser: {e}")
        return jsonify({"error": "Internal Server Error"}), 500


def set_car_unavailable_later(car_id, delay):
    def update_availability():
        with app.app_context():
            car = Car.query.get(car_id)
            if car:
                car.available = "false"
                db.session.commit()
                print(f"Car ID {car_id} is now unavailable.")
    timer = threading.Timer(delay, update_availability)
    timer.start()


def set_car_available_later(car_id, delay):
    def update_availability():
        with app.app_context():
            car = Car.query.get(car_id)
            if car:
                car.available = "true"
                db.session.commit()
                print(f"Car ID {car_id} is now available.")
    timer = threading.Timer(delay, update_availability)
    timer.start()


@app.route("/reservation", methods=["POST"])
@jwt_required()
def make_reservation():
    try:
        data = request.get_json()
        print("Request data:", data)

        car_id = data.get("car_id")
        user_id = get_jwt_identity()["id"]
        reservation_date = datetime.fromisoformat(data.get("reservation_date")).replace(tzinfo=ZoneInfo("Europe/Warsaw"))
        return_date = datetime.fromisoformat(data.get("return_date")).replace(tzinfo=ZoneInfo("Europe/Warsaw"))

        print(f"Car ID: {car_id}, User ID: {user_id}, Reservation Date: {reservation_date}, Return Date: {return_date}")

        car = Car.query.get(car_id)
        if not car or not car.available:
            return jsonify({"error": "Car not available"}), 400

        conflicting_reservations = Reservation.query.filter(
            Reservation.car_id == car_id,
            Reservation.return_date > reservation_date,
            Reservation.reservation_date < return_date
        ).all()

        if conflicting_reservations:
            return jsonify({"error": "Car is already reserved during this time"}), 400

        reservation = Reservation(
            car_id=car_id,
            user_id=user_id,
            reservation_date=reservation_date,
            return_date=return_date,
        )
        db.session.add(reservation)
        db.session.commit()

        delay_to_start = (reservation_date - datetime.now(ZoneInfo("Europe/Warsaw"))).total_seconds()
        delay_to_end = (return_date - datetime.now(ZoneInfo("Europe/Warsaw"))).total_seconds()

        print(f"Scheduling availability updates for car ID {car_id}")
        set_car_unavailable_later(car_id, delay_to_start)
        set_car_available_later(car_id, delay_to_end)

        return jsonify({"message": "Reservation created successfully", "reservation": reservation.to_json_reservation()}), 201
    except IntegrityError as e:
        db.session.rollback()
        print("IntegrityError in make_reservation:", str(e))
        return jsonify({"error": "Database error"}), 400
    except Exception as e:
        print("Error in make_reservation:", str(e))
        return jsonify({"error": "Internal Server Error"}), 500


@app.route("/getreservation", methods=["GET"])
@jwt_required()
def get_reservations():
    try:
        current_user_id = get_jwt_identity()["id"]
        current_user = User.query.get(current_user_id)

        print(f"Current User ID: {current_user_id}")
        print(f"Current User: {current_user}")

        if not current_user:
            return jsonify({"error": "User not found"}), 404

        if current_user.username == "admin":
            reservations = Reservation.query.all()
        else:
            reservations = Reservation.query.filter_by(user_id=current_user_id).all()

        print(f"Reservations: {reservations}")

        reservations_data = [reservation.to_json_reservation() for reservation in reservations]
        return jsonify({"reservations": reservations_data}), 200
    except Exception as e:
        print("Error in get_reservations:", str(e))
        return jsonify({"error": "Internal Server Error"}), 500







