"""
Demo Application Main Module
Contains intentional issues for the autonomous agent to detect and fix.
"""

from flask import Flask, request, jsonify
from auth import AuthManager
from data_processor import DataProcessor
from payment_service import PaymentService
from validators import EmailValidator

app = Flask(__name__)
auth_manager = AuthManager()
data_processor = DataProcessor()
payment_service = PaymentService()
email_validator = EmailValidator()

@app.route('/api/login', methods=['POST'])
def login():
    """User login endpoint"""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    # This will fail due to broken JWT implementation
    token = auth_manager.authenticate(username, password)
    
    if token:
        return jsonify({'token': token, 'status': 'success'})
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/validate-email', methods=['POST'])
def validate_email():
    """Email validation endpoint"""
    data = request.get_json()
    email = data.get('email')
    
    # This will fail due to broken email validation
    is_valid = email_validator.validate(email)
    
    return jsonify({'valid': is_valid, 'email': email})

@app.route('/api/process-data', methods=['POST'])
def process_data():
    """Data processing endpoint - has O(n²) performance issue"""
    data = request.get_json()
    items = data.get('items', [])
    
    # This uses inefficient O(n²) algorithm
    processed = data_processor.process_items(items)
    
    return jsonify({'processed_items': processed, 'count': len(processed)})

@app.route('/api/payment', methods=['POST'])
def process_payment():
    """Payment processing endpoint - lacks error handling"""
    data = request.get_json()
    amount = data.get('amount')
    card_token = data.get('card_token')
    
    # This lacks proper error handling
    result = payment_service.charge(amount, card_token)
    
    return jsonify(result)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'service': 'demo-app'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
