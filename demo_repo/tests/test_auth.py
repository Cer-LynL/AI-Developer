"""
Authentication tests - these will fail due to JWT secret key mismatch
"""

import pytest
import os
from src.auth import AuthManager

class TestAuthManager:
    def setup_method(self):
        self.auth_manager = AuthManager()
        # Set the correct environment variable for testing
        os.environ['JWT_SECRET_KEY'] = 'default-secret'
    
    def test_authenticate_valid_user(self):
        """Test authentication with valid credentials"""
        token = self.auth_manager.authenticate("demo", "password")
        assert token is not None
        assert isinstance(token, str)
    
    def test_authenticate_invalid_user(self):
        """Test authentication with invalid credentials"""
        token = self.auth_manager.authenticate("invalid", "wrong")
        assert token is None
    
    def test_validate_token(self):
        """
        Test token validation - THIS WILL FAIL
        Due to secret key mismatch between authenticate() and validate_token()
        """
        # Get a token
        token = self.auth_manager.authenticate("demo", "password")
        assert token is not None
        
        # Try to validate it - this will fail due to secret key mismatch
        payload = self.auth_manager.validate_token(token)
        assert payload is not None  # This assertion will fail
        assert payload['username'] == 'demo'
    
    def test_validate_invalid_token(self):
        """Test validation of invalid token"""
        payload = self.auth_manager.validate_token("invalid.token.here")
        assert payload is None
    
    def test_token_contains_correct_claims(self):
        """
        Test that token contains expected claims - THIS WILL ALSO FAIL
        Because we can't validate the token due to secret key mismatch
        """
        token = self.auth_manager.authenticate("demo", "password")
        payload = self.auth_manager.validate_token(token)
        
        # These assertions will fail because payload is None
        assert 'username' in payload
        assert 'exp' in payload
        assert 'iat' in payload
        assert payload['username'] == 'demo'
