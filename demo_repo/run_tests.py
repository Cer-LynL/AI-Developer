#!/usr/bin/env python3
"""
Test runner for the demo application
This will show failing tests that the autonomous agent should detect and fix
"""

import subprocess
import sys
import os

def run_tests():
    """Run the test suite and display results"""
    print("🧪 Running Demo Application Test Suite")
    print("=" * 50)
    
    # Add src directory to Python path
    current_dir = os.path.dirname(os.path.abspath(__file__))
    src_path = os.path.join(current_dir, 'src')
    if src_path not in sys.path:
        sys.path.insert(0, current_dir)
    
    try:
        # Run pytest with verbose output
        result = subprocess.run([
            sys.executable, '-m', 'pytest', 
            'tests/', 
            '-v', 
            '--tb=short',
            '--color=yes'
        ], capture_output=True, text=True, cwd=current_dir)
        
        print("STDOUT:")
        print(result.stdout)
        
        if result.stderr:
            print("\nSTDERR:")
            print(result.stderr)
        
        print(f"\nTest run completed with return code: {result.returncode}")
        
        if result.returncode != 0:
            print("\n❌ TESTS FAILED - Issues detected for autonomous agent to fix:")
            print("1. JWT token validation failures (secret key mismatch)")
            print("2. Email validation regex issues (doesn't handle dots, plus signs)")
            print("3. Performance issues in data processor (O(n²) complexity)")
            print("4. Missing error handling in payment service")
        else:
            print("\n✅ All tests passed!")
            
        return result.returncode
        
    except FileNotFoundError:
        print("❌ pytest not found. Please install requirements:")
        print("pip install -r requirements.txt")
        return 1
    except Exception as e:
        print(f"❌ Error running tests: {e}")
        return 1

if __name__ == "__main__":
    exit_code = run_tests()
    sys.exit(exit_code)
