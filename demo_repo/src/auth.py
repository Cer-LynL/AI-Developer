"""
Authentication module with intentional JWT issues
"""

import jwt
import os
from datetime import datetime, timedelta

class AuthManager:
    def __init__(self):
        # This is intentionally wrong - should use environment variable
        self.secret_key = "wrong-secret-key"
        self.algorithm = "HS256"
    
    def authenticate(self, username, password):
        """
        Authenticate user and return JWT token
        Contains intentional bug: wrong secret key
        """
        # Simple hardcoded user check for demo
        if username == "demo" and password == "password":
            payload = {
                'username': username,
                'exp': datetime.utcnow() + timedelta(hours=24),
                'iat': datetime.utcnow()
            }
            
            # This will fail validation later due to wrong secret
            token = jwt.encode(payload, self.secret_key, algorithm=self.algorithm)
            return token
        
        return None
    
    def validate_token(self, token):
        """
        Validate JWT token
        This will fail due to secret key mismatch
        """
        try:
            # This should use the correct environment variable
            correct_secret = os.getenv('JWT_SECRET_KEY', 'default-secret')
            payload = jwt.decode(token, correct_secret, algorithms=[self.algorithm])
            return payload
        except jwt.InvalidTokenError:
            return None
