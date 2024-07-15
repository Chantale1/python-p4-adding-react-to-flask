from flask import Flask, request, make_response, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from models import db, Message

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json_encoder.compact = False  # Correcting attribute name

CORS(app)
migrate = Migrate(app, db)

db.init_app(app)

# Route to handle GET and POST requests for messages
@app.route('/messages', methods=['GET', 'POST'])
def messages():
    if request.method == 'GET':
        try:
            messages = Message.query.order_by(Message.created_at).all()
            return jsonify([message.to_dict() for message in messages]), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    elif request.method == 'POST':
        try:
            data = request.get_json()
            message = Message(body=data['body'], username=data['username'])
            db.session.add(message)
            db.session.commit()
            return jsonify(message.to_dict()), 201
        except KeyError:
            return jsonify({'error': 'Missing required fields'}), 400
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

# Route to handle PATCH and DELETE requests for a specific message
@app.route('/messages/<int:id>', methods=['PATCH', 'DELETE'])
def messages_by_id(id):
    message = Message.query.get_or_404(id)

    if request.method == 'PATCH':
        try:
            data = request.get_json()
            for attr, value in data.items():
                setattr(message, attr, value)
            db.session.commit()
            return jsonify(message.to_dict()), 200
        except KeyError:
            return jsonify({'error': 'Missing required fields'}), 400
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

    elif request.method == 'DELETE':
        try:
            db.session.delete(message)
            db.session.commit()
            return jsonify({'deleted': True}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(port=5555)

