"""
Validation module with intentional email validation issues
"""

import re

class EmailValidator:
    def __init__(self):
        # This regex is intentionally broken - doesn't handle edge cases
        self.email_pattern = r'^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]+$'
    
    def validate(self, email):
        """
        Validate email address
        Contains intentional bug: regex doesn't handle dots, plus signs, etc.
        """
        if not email:
            return False
        
        # This regex is too restrictive and will fail many valid emails
        return bool(re.match(self.email_pattern, email))
    
    def validate_phone(self, phone):
        """
        Validate phone number - also has issues
        """
        # Overly simple validation
        return len(phone) == 10 and phone.isdigit()
