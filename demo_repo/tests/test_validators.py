"""
Validation tests - these will fail due to broken email regex
"""

import pytest
from src.validators import EmailValidator

class TestEmailValidator:
    def setup_method(self):
        self.validator = EmailValidator()
    
    def test_valid_simple_email(self):
        """Test simple valid email - this should pass"""
        assert self.validator.validate("user@example.com") == True
    
    def test_valid_email_with_dots(self):
        """
        Test email with dots in username - THIS WILL FAIL
        The regex doesn't handle dots in the username part
        """
        assert self.validator.validate("user.name@example.com") == True
    
    def test_valid_email_with_plus(self):
        """
        Test email with plus sign - THIS WILL FAIL
        The regex doesn't handle plus signs
        """
        assert self.validator.validate("user+tag@example.com") == True
    
    def test_valid_email_with_subdomain(self):
        """
        Test email with subdomain - THIS WILL FAIL
        The regex doesn't handle dots in domain part properly
        """
        assert self.validator.validate("user@mail.example.com") == True
    
    def test_valid_email_with_numbers(self):
        """Test email with numbers - this should pass"""
        assert self.validator.validate("user123@example123.com") == True
    
    def test_invalid_email_no_at(self):
        """Test invalid email without @ symbol"""
        assert self.validator.validate("userexample.com") == False
    
    def test_invalid_email_no_domain(self):
        """Test invalid email without domain"""
        assert self.validator.validate("user@") == False
    
    def test_invalid_email_no_tld(self):
        """Test invalid email without TLD"""
        assert self.validator.validate("user@example") == False
    
    def test_empty_email(self):
        """Test empty email"""
        assert self.validator.validate("") == False
        assert self.validator.validate(None) == False
    
    def test_valid_international_email(self):
        """
        Test international domain - THIS WILL FAIL
        The regex doesn't handle international characters
        """
        assert self.validator.validate("user@münchen.de") == True

class TestPhoneValidator:
    def setup_method(self):
        self.validator = EmailValidator()
    
    def test_valid_phone(self):
        """Test valid 10-digit phone"""
        assert self.validator.validate_phone("1234567890") == True
    
    def test_invalid_phone_too_short(self):
        """Test phone too short"""
        assert self.validator.validate_phone("123456789") == False
    
    def test_invalid_phone_too_long(self):
        """Test phone too long"""
        assert self.validator.validate_phone("12345678901") == False
    
    def test_invalid_phone_with_letters(self):
        """Test phone with letters"""
        assert self.validator.validate_phone("123456789a") == False
