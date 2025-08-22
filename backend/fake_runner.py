import asyncio
import random
from typing import List
from datetime import datetime

from models import TestResult, CodeAnalysis

class FakeTestRunner:
    """Simulates test execution for demo purposes"""
    
    def __init__(self):
        self.demo_tests = [
            "test_user_authentication",
            "test_data_validation", 
            "test_api_endpoints",
            "test_database_connection",
            "test_file_upload",
            "test_payment_processing",
            "test_email_notifications",
            "test_search_functionality"
        ]
        
        self.demo_failures = [
            {
                "test_name": "test_user_authentication",
                "error": "AssertionError: Expected status code 200, got 401"
            },
            {
                "test_name": "test_data_validation", 
                "error": "ValueError: Invalid email format in user input"
            }
        ]
    
    async def run_tests(self, repo_path: str) -> List[TestResult]:
        """Simulate running the full test suite"""
        await asyncio.sleep(2)  # Simulate test execution time
        
        results = []
        
        # Create some passing tests
        for test_name in self.demo_tests:
            duration = random.uniform(0.1, 2.5)
            
            # Randomly fail some tests for demo
            if test_name in [f["test_name"] for f in self.demo_failures]:
                failure = next(f for f in self.demo_failures if f["test_name"] == test_name)
                results.append(TestResult(
                    test_name=test_name,
                    status="failed",
                    duration=duration,
                    error_message=failure["error"]
                ))
            else:
                results.append(TestResult(
                    test_name=test_name,
                    status="passed",
                    duration=duration
                ))
        
        return results
    
    async def run_specific_test(self, repo_path: str, test_name: str) -> TestResult:
        """Simulate running a specific test after a fix"""
        await asyncio.sleep(0.5)  # Simulate test time
        
        # After a "fix", tests should pass
        return TestResult(
            test_name=test_name,
            status="passed",
            duration=random.uniform(0.1, 1.0)
        )
    
    async def run_performance_tests(self, repo_path: str) -> List[TestResult]:
        """Simulate running performance tests"""
        await asyncio.sleep(1.5)
        
        perf_tests = [
            "test_api_response_time",
            "test_database_query_performance", 
            "test_memory_usage",
            "test_concurrent_users"
        ]
        
        results = []
        for test_name in perf_tests:
            results.append(TestResult(
                test_name=test_name,
                status="passed",
                duration=random.uniform(0.5, 3.0)
            ))
        
        return results

class FakeCodeAnalyzer:
    """Simulates code analysis for optimization opportunities"""
    
    def __init__(self):
        self.demo_files = [
            "src/utils/data_processor.py",
            "src/api/user_controller.py",
            "src/services/payment_service.py",
            "src/models/user_model.py",
            "src/utils/search_engine.py"
        ]
    
    async def analyze_codebase(self, repo_path: str) -> List[CodeAnalysis]:
        """Simulate analyzing codebase for issues and improvements"""
        await asyncio.sleep(1)  # Simulate analysis time
        
        analyses = []
        
        # Create some high-complexity files that need optimization
        high_complexity_files = [
            {
                "file_path": "src/utils/data_processor.py",
                "complexity_score": 9,
                "issues": [
                    {"type": "performance", "description": "O(n²) nested loop in process_data()"},
                    {"type": "memory", "description": "Large list comprehensions causing memory spikes"}
                ],
                "suggestions": [
                    "Replace nested loops with hash map lookup",
                    "Use generators instead of list comprehensions",
                    "Add caching for repeated calculations"
                ]
            },
            {
                "file_path": "src/api/user_controller.py", 
                "complexity_score": 8,
                "issues": [
                    {"type": "database", "description": "N+1 query problem in get_user_details()"},
                    {"type": "validation", "description": "Repeated validation logic"}
                ],
                "suggestions": [
                    "Use eager loading for related data",
                    "Extract validation to decorator",
                    "Add request caching"
                ]
            },
            {
                "file_path": "src/services/payment_service.py",
                "complexity_score": 7,
                "issues": [
                    {"type": "error_handling", "description": "Missing error handling for API calls"},
                    {"type": "retry_logic", "description": "No retry mechanism for failed payments"}
                ],
                "suggestions": [
                    "Add exponential backoff retry",
                    "Implement circuit breaker pattern",
                    "Add comprehensive error logging"
                ]
            }
        ]
        
        for file_data in high_complexity_files:
            analyses.append(CodeAnalysis(
                file_path=file_data["file_path"],
                issues=file_data["issues"],
                suggestions=file_data["suggestions"],
                complexity_score=file_data["complexity_score"]
            ))
        
        # Add some low-complexity files
        for file_path in self.demo_files:
            if file_path not in [f["file_path"] for f in high_complexity_files]:
                analyses.append(CodeAnalysis(
                    file_path=file_path,
                    issues=[],
                    suggestions=[],
                    complexity_score=random.randint(2, 6)
                ))
        
        return analyses
