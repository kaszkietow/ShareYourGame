# 🎮 Game Rental API

API umożliwiające wynajem gier wideo między użytkownikami. Pozwala na rejestrację, dodawanie gier, wypożyczanie oraz zarządzanie użytkownikami.

## 🛠 Technologie

- **Python** (Flask)
- **Flask-JWT-Extended** (autoryzacja użytkowników)
- **SQLAlchemy** (baza danych)
- **SQLite / PostgreSQL** (domyślna baza danych)
- **Flask-Swagger-UI** (dokumentacja API)
- **ZoneInfo** (obsługa stref czasowych)
- **Threading** (obsługa opóźnionych zmian dostępności gier)

## 📦 Instalacja

1. **Sklonuj repozytorium**
   ```sh
   git clone https://github.com/kaszkietow/ShareYourGame.git
   cd game-rental-api
   ```

2. **Utwórz i aktywuj wirtualne środowisko**
   ```sh
   python -m venv venv
   source venv/bin/activate  # MacOS/Linux
   venv\Scripts\activate     # Windows
   ```

3. **Zainstaluj wymagane pakiety**
   ```sh
   pip install -r requirements.txt
   ```

4. **Skonfiguruj bazę danych**
   ```sh
   flask db upgrade
   ```

5. **Uruchom aplikację**
   ```sh
   flask run
   ```

## 🔑 Autoryzacja (JWT)

Każde żądanie do chronionych endpointów wymaga tokena JWT. Uzyskanie tokena:
```sh
curl -X POST http://localhost:5000/login -H "Content-Type: application/json" -d '{"username":"testuser","password":"password"}'
```
Odpowiedź zawiera token:
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLC..."
}
```
Wszystkie żądania powinny zawierać nagłówek:
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## 📌 Endpointy

### 🔹 Użytkownicy

#### 🔹 Rejestracja nowego użytkownika
**POST** `/api/register`
```json
{
  "username": "testuser",
  "password": "password123",
  "gender": "male",
  "location": "Warsaw"
}
```

#### 🔹 Pobranie wszystkich użytkowników
**GET** `/api/users`

#### 🔹 Usunięcie użytkownika (wymaga JWT)  
**DELETE** `/api/users/<id>`

#### 🔹 Aktualizacja danych użytkownika (wymaga JWT)  
**PATCH** `/api/users/<id>`

### 🔹 Gry

#### 🔹 Pobranie listy gier  
**GET** `/api/games` _(wymaga JWT)_

#### 🔹 Dodanie nowej gry  
**POST** `/api/games` _(wymaga JWT)_
```json
{
  "title": "FIFA 23",
  "platform": "PS5",
  "genre": "Sports",
  "condition": "New",
  "img_url": "https://example.com/game.jpg",
  "description": "Football simulation game",
  "price_per_day": 5.99,
  "available": "true",
  "owner_id": 1
}
```

#### 🔹 Usunięcie gry  
**DELETE** `/api/games/<id>` _(wymaga JWT)_

#### 🔹 Aktualizacja gry  
**PATCH** `/api/games/<id>` _(wymaga JWT)_

### 🔹 Wynajem

#### 🔹 Wypożyczenie gry  
**POST** `/rental` _(wymaga JWT)_
```json
{
  "game_id": 1,
  "start_date": "2024-02-01T10:00:00",
  "end_date": "2024-02-05T10:00:00"
}
```

#### 🔹 Pobranie wypożyczeń użytkownika  
**GET** `/getrental` _(wymaga JWT)_

### 🔹 Autoryzacja

#### 🔹 Logowanie  
**POST** `/login`
```json
{
  "username": "testuser",
  "password": "password123"
}
```

#### 🔹 Wylogowanie  
**POST** `/logout` _(wymaga JWT)_

#### 🔹 Pobranie danych aktualnie zalogowanego użytkownika  
**GET** `/current_user` _(wymaga JWT)_

## 📌 Modele danych

### 🧑 Model `User`
```python
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    img_url = db.Column(db.String(200), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    games = db.relationship('Game', backref='owner', lazy=True)
    rentals = db.relationship('Rental', backref='renter', lazy=True)
```

### 🎮 Model `Game`
```python
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
```

### 📅 Model `Rental`
```python
class Rental(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    game_id = db.Column(db.Integer, db.ForeignKey('game.id'), nullable=False)
    renter_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    end_date = db.Column(db.DateTime, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default="pending")
```
### 💰 Model `Payment` (jeszcze nie obslugiwany)
```
class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    rental_id = db.Column(db.Integer, db.ForeignKey('rental.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default="pending")  # pending, completed, failed
    payment_date = db.Column(db.DateTime, default=datetime.utcnow)
```


## 🔥 Przyszłe funkcjonalności

- Integracja z systemem płatności (np. Stripe, PayPal)
- Powiadomienia e-mail o rezerwacjach
- Recenzje i oceny gier
- System wiadomości między użytkownikami

