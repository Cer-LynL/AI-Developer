# Demo Application

This is a demo Python application designed to showcase the Autonomous Developer Agent's capabilities. It contains intentional issues including:

- Failing tests
- Inefficient algorithms (O(n²) complexity)
- Code quality issues
- Missing error handling

The agent will automatically detect these issues and propose fixes.

## Structure

- `src/` - Main application code
- `tests/` - Test suite (contains failing tests)
- `requirements.txt` - Python dependencies
- `run_tests.py` - Test runner script

## Running the Application

```bash
# Install dependencies
pip install -r requirements.txt

# Run tests
python run_tests.py

# Run the application
python src/main.py
```

## Known Issues

1. **Authentication Test Failure**: JWT token validation is broken
2. **Data Validation Test Failure**: Email validation regex has issues
3. **Performance Issues**: Data processor uses O(n²) algorithm
4. **Missing Error Handling**: Payment service lacks proper error handling

The Autonomous Developer Agent should detect and fix these issues automatically.
