import asyncio
import uuid
from typing import Dict, Any
from datetime import datetime

from models import PullRequest

class MockGitClient:
    """Mock Git client that simulates GitHub/GitLab API interactions"""
    
    def __init__(self):
        self.base_url = "https://api.github.com"
        self.created_prs = []
        
    async def clone_repository(self, repo_url: str) -> Dict[str, Any]:
        """Simulate cloning a repository"""
        await asyncio.sleep(1)  # Simulate clone time
        
        repo_name = repo_url.split('/')[-1].replace('.git', '')
        clone_path = f"/tmp/cloned_repos/{repo_name}"
        
        return {
            "path": clone_path,
            "repo_name": repo_name,
            "status": "success",
            "size": "2.3 MB",
            "files_count": 47
        }
    
    async def apply_fix(self, repo_path: str, test_name: str, fix_code: str) -> Dict[str, Any]:
        """Simulate applying a fix to the repository"""
        await asyncio.sleep(0.5)  # Simulate fix application time
        
        # Determine which file to "fix" based on test name
        if "authentication" in test_name:
            file_path = "src/auth/middleware.py"
        elif "validation" in test_name:
            file_path = "src/utils/validators.py"
        elif "database" in test_name:
            file_path = "src/db/connection.py"
        else:
            file_path = "src/main.py"
        
        return {
            "status": "success",
            "modified_files": [file_path],
            "lines_changed": len(fix_code.split('\n')),
            "commit_hash": f"fix-{uuid.uuid4().hex[:8]}"
        }
    
    async def generate_diff(self, code_changes: str) -> str:
        """Generate a realistic-looking diff for the changes"""
        
        # Create a mock diff that looks realistic
        diff_lines = [
            "diff --git a/src/utils/data_processor.py b/src/utils/data_processor.py",
            "index 1234567..abcdefg 100644",
            "--- a/src/utils/data_processor.py",
            "+++ b/src/utils/data_processor.py",
            "@@ -15,12 +15,8 @@ class DataProcessor:",
            "     def process_data(self, data_list):",
            "-        results = []",
            "-        for item in data_list:",
            "-            for other_item in data_list:",
            "-                if item.related_id == other_item.id:",
            "-                    results.append(combine_items(item, other_item))",
            "-        return results",
            "+        # Optimized with hash map lookup",
            "+        data_map = {item.id: item for item in data_list}",
            "+        results = []",
            "+        for item in data_list:",
            "+            related_item = data_map.get(item.related_id)",
            "+            if related_item:",
            "+                results.append(combine_items(item, related_item))",
            "+        return results"
        ]
        
        return '\n'.join(diff_lines)
    
    async def create_pull_request(self, repo_url: str, pr: PullRequest) -> Dict[str, Any]:
        """Simulate creating a pull request via GitHub API"""
        await asyncio.sleep(0.5)  # Simulate API call time
        
        # Store the PR for tracking
        self.created_prs.append(pr)
        
        # Generate a mock PR URL
        repo_name = repo_url.split('/')[-1].replace('.git', '')
        pr_url = f"https://github.com/demo-org/{repo_name}/pull/{len(self.created_prs)}"
        
        return {
            "status": "success",
            "pr_number": len(self.created_prs),
            "pr_url": pr_url,
            "branch_created": True,
            "checks_pending": True
        }
    
    async def get_repository_info(self, repo_url: str) -> Dict[str, Any]:
        """Get repository information"""
        await asyncio.sleep(0.2)
        
        repo_name = repo_url.split('/')[-1].replace('.git', '')
        
        return {
            "name": repo_name,
            "full_name": f"demo-org/{repo_name}",
            "description": "Demo repository for autonomous agent testing",
            "language": "Python",
            "stars": 42,
            "forks": 7,
            "open_issues": 3,
            "default_branch": "main",
            "last_commit": {
                "sha": "abc123def456",
                "message": "feat: add new feature",
                "author": "demo-developer",
                "date": datetime.now().isoformat()
            }
        }
    
    async def create_branch(self, repo_path: str, branch_name: str) -> Dict[str, Any]:
        """Simulate creating a new branch"""
        await asyncio.sleep(0.3)
        
        return {
            "status": "success",
            "branch_name": branch_name,
            "base_branch": "main",
            "commit_hash": f"branch-{uuid.uuid4().hex[:8]}"
        }
    
    async def commit_changes(self, repo_path: str, message: str, files: list) -> Dict[str, Any]:
        """Simulate committing changes"""
        await asyncio.sleep(0.4)
        
        return {
            "status": "success",
            "commit_hash": f"commit-{uuid.uuid4().hex[:8]}",
            "message": message,
            "files_changed": len(files),
            "insertions": sum(len(f.get('content', '').split('\n')) for f in files),
            "deletions": 0
        }
    
    def get_created_prs(self) -> list:
        """Get all PRs created by the agent"""
        return self.created_prs
