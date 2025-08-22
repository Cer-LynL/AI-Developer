"""
Payment service module with intentional error handling issues
"""

import requests
import time

class PaymentService:
    def __init__(self):
        self.api_url = "https://api.payment-provider.com"
        self.api_key = "demo-api-key"
    
    def charge(self, amount, card_token):
        """
        Process payment charge
        Contains intentional issues: no error handling, no retries
        """
        payload = {
            'amount': amount,
            'card_token': card_token,
            'currency': 'USD'
        }
        
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }
        
        # This lacks proper error handling and retry logic
        response = requests.post(
            f"{self.api_url}/charges",
            json=payload,
            headers=headers,
            timeout=5  # Short timeout, no retry
        )
        
        # No error handling - will crash on API errors
        return response.json()
    
    def refund(self, charge_id, amount=None):
        """
        Process refund - also lacks error handling
        """
        payload = {'charge_id': charge_id}
        if amount:
            payload['amount'] = amount
        
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }
        
        # No error handling here either
        response = requests.post(
            f"{self.api_url}/refunds",
            json=payload,
            headers=headers
        )
        
        return response.json()
    
    def get_charge_status(self, charge_id):
        """
        Get charge status - minimal error handling
        """
        try:
            response = requests.get(
                f"{self.api_url}/charges/{charge_id}",
                headers={'Authorization': f'Bearer {self.api_key}'}
            )
            return response.json()
        except:
            # Poor error handling - catches all exceptions
            return {'error': 'Failed to get status'}
    
    def batch_charges(self, charges):
        """
        Process multiple charges - no error recovery
        """
        results = []
        
        for charge in charges:
            # No error handling - one failure breaks everything
            result = self.charge(charge['amount'], charge['card_token'])
            results.append(result)
            
            # No rate limiting consideration
            time.sleep(0.1)
        
        return results
