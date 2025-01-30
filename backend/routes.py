import datetime
from app import app, db
from flask import request, jsonify, Flask, redirect, send_from_directory
from models import Game, User, Rental
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


@app.route("/api/games", methods=["GET"])
@jwt_required()
def get_games():
    try:
        games = Game.query.all()
        game_json = [game.to_json_game_with_owner() for game in games]
        return jsonify(game_json), 200
    except Exception as e:
        print(f"Error fetching games: {e}")
        return jsonify({"error": "Internal Server Error"}), 500


# Add new card
@app.route("/api/games", methods=["POST"])
@jwt_required()
def create_game():
    try:
        data = request.json
        print(f"Received data: {data}")
        required_fields = ["title", "platform", "genre", "condition", "img_url", "description", "price_per_day",
                           "available"]
        for field in required_fields:
            if field not in data or not data.get(field):
                return jsonify({"error": f"Missing required field: {field}"}), 400

        id = data.get("id")
        title = data.get("title")
        platform = data.get("platform")
        genre = data.get("genre")
        condition = data.get("condition")
        img_url = data.get("img_url")
        description = data.get("description")
        price_per_day = data.get("price_per_day")
        available = data.get("available")
        owner_id = data.get("owner_id")

        new_game = Game(
            id=id, title=title, platform=platform, genre=genre, condition=condition,
            description=description, price_per_day=price_per_day,
            available=available, img_url=img_url, owner_id=owner_id
        )
        db.session.add(new_game)
        db.session.commit()
        return jsonify(new_game.to_json_game_with_owner()), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/games/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_game(id):
    try:
        game = Game.query.get(id)
        if game is None:
            return jsonify({"error": "Game doesn't exist"}), 404

        Rental.query.filter_by(game_id=game.id).delete()
        db.session.commit()

        db.session.delete(game)
        db.session.commit()
        return jsonify({"message": "Game deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@app.route("/api/games/<int:id>", methods=["PATCH"])
@jwt_required()
def update_game(id):
    try:
        game = Game.query.get(id)
        if game is None:
            return jsonify({"error": "Game not found"}), 404

        data = request.json

        game.title = data.get("title", game.title)
        game.platform = data.get("platform", game.platform)
        game.genre = data.get("genre", game.genre)
        game.condition = data.get("condition", game.condition)
        game.img_url = data.get("img_url", game.img_url)
        game.description = data.get("description", game.description)
        game.price_per_day = data.get("price_per_day", game.price_per_day)
        game.available = data.get("available", game.available)

        db.session.commit()
        return jsonify(game.to_json_game_with_owner()), 200
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

        required_fields = ["username", "password", "gender", "location"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        username = data.get("username")
        password = data.get("password")
        gender = data.get("gender")
        location = data.get("location")

        if not username or len(username.strip()) < 3:
            return jsonify({"error": "Username must be at least 3 characters long"}), 400

        if not password or len(password) < 6:
            return jsonify({"error": "Password must be at least 6 characters long"}), 400

        if gender not in ["male", "female"]:
            return jsonify({"error": "Gender must be either 'male' or 'female'"}), 400

        if not location:
            return jsonify({"error": "Location is required."}), 400

        if User.query.filter_by(username=username).first():
            return jsonify({"error": "Username already exists"}), 400

        if gender == "male":
            img_url = f"https://avatar.iran.liara.run/public/boy?username={username}"
        else:
            img_url = f"https://avatar.iran.liara.run/public/girl?username={username}"

        new_user = User(username=username, password=password, gender=gender, img_url=img_url, location=location)
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

        print(f"Deleting user: {user.id}")

        games_to_delete = Game.query.filter_by(owner_id=id).all()
        if games_to_delete:
            print(f"Found {len(games_to_delete)} games to delete.")
        else:
            print("No games found for this user.")

        for game in games_to_delete:
            rentals_to_delete = Rental.query.filter_by(game_id=game.id).all()
            for rental in rentals_to_delete:
                db.session.delete(rental)

            db.session.delete(game)

        db.session.delete(user)
        db.session.commit()

        print(f"User {user.id} and associated games deleted successfully.")
        return jsonify({"message": "User and associated games deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error while deleting user: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/users/<int:id>", methods=["PATCH"])
@jwt_required()
def update_user(id):
    try:
        user = User.query.get(id)
        if user is None:
            return jsonify({"error": "User not found"}), 404

        current_user_id = get_jwt_identity()["id"]
        current_user = User.query.get(current_user_id)

        data = request.json

        username = data.get("username")
        if username:
            existing_user = User.query.filter_by(username=username).first()
            if existing_user and existing_user.id != user.id:
                return jsonify({"error": "This username is already taken"}), 400

        if current_user.username == "admin" and current_user.id != user.id:
            if username:
                user.username = username

        password = data.get("password")
        location = data.get("location")

        if password:
            user.password = password
        if location:
            user.location = location

        db.session.commit()
        return jsonify(user.to_json_user()), 200

    except Exception as e:
        db.session.rollback()
        print("Error while updating user:", e)
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


def set_game_unavailable_later(game_id, delay):
    def update_availability():
        with app.app_context():
            game = Game.query.get(game_id)
            if game:
                game.available = "false"
                db.session.commit()
                print(f"Game ID {game_id} is now unavailable.")
    timer = threading.Timer(delay, update_availability)
    timer.start()


def set_game_available_later(game_id, delay):
    def update_availability():
        with app.app_context():
            game = Game.query.get(game_id)
            if game:
                game.available = "true"
                db.session.commit()
                print(f"Game ID {game_id} is now available.")
    timer = threading.Timer(delay, update_availability)
    timer.start()


@app.route("/rental", methods=["POST"])
@jwt_required()
def make_reservation():
    try:
        data = request.get_json()
        print("Request data:", data)

        game_id = data.get("game_id")
        renter_id = get_jwt_identity()["id"]
        start_date = datetime.fromisoformat(data.get("start_date")).replace(tzinfo=ZoneInfo("Europe/Warsaw"))
        end_date = datetime.fromisoformat(data.get("end_date")).replace(tzinfo=ZoneInfo("Europe/Warsaw"))

        print(f"Game ID: {game_id}, Renter ID: {renter_id}, Rental Date: {start_date}, Return Date: {end_date}")

        game = Game.query.get(game_id)
        if not game or not game.available:
            return jsonify({"error": "Game not available"}), 400

        conflicting_rentals = Rental.query.filter(
            Rental.game_id == game_id,
            Rental.start_date > start_date,
            Rental.start_date < end_date
        ).all()

        if conflicting_rentals:
            return jsonify({"error": "Game is already reserved during this time"}), 400

        rental_days = (end_date - start_date).days + 1
        total_price = game.price_per_day * rental_days

        rental = Rental(
            game_id=game_id,
            renter_id=renter_id,
            start_date=start_date,
            end_date=end_date,
            status="pending",
            total_price=total_price,
        )
        db.session.add(rental)
        db.session.commit()

        delay_to_start = (start_date - datetime.now(ZoneInfo("Europe/Warsaw"))).total_seconds()
        delay_to_end = (end_date - datetime.now(ZoneInfo("Europe/Warsaw"))).total_seconds()

        print(f"Scheduling availability updates for car ID {game_id}")
        set_game_unavailable_later(game_id, delay_to_start)
        set_game_available_later(game_id, delay_to_end)

        return jsonify({"message": "Rental created successfully", "rental": rental.to_json_rental()}), 201
    except IntegrityError as e:
        db.session.rollback()
        print("IntegrityError in make_rental:", str(e))
        return jsonify({"error": "Database error"}), 400
    except Exception as e:
        print("Error in make_rental:", str(e))
        return jsonify({"error": "Internal Server Error"}), 500


@app.route("/getrental", methods=["GET"])
@jwt_required()
def get_rentals():
    try:
        current_user_id = get_jwt_identity()["id"]
        current_user = User.query.get(current_user_id)

        print(f"Current User ID: {current_user_id}")
        print(f"Current User: {current_user}")

        if not current_user:
            return jsonify({"error": "User not found"}), 404

        if current_user.username == "admin":
            rentals = Rental.query.all()
        else:
            rentals = Rental.query.filter_by(renter_id=current_user_id).all()

        print(f"Rentals: {rentals}")

        rentals_data = [rental.to_json_rental() for rental in rentals]
        user_data = {
            "id": current_user.id,
            "username": current_user.username
        }

        return jsonify({"user": user_data, "rentals": rentals_data}), 200
    except Exception as e:
        print("Error in get_rentals:", str(e))
        return jsonify({"error": "Internal Server Error"}), 500

