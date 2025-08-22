import asyncio
import json
import uuid
from datetime import datetime
from typing import Dict, List, Any
import logging

from models import Repository, CommitEvent, AgentJob, PullRequest, TestResult
from fake_runner import FakeTestRunner, FakeCodeAnalyzer
from llm_client import OllamaClient
from git_client import MockGitClient
from slack_client import MockSlackClient
from jira_client import MockJiraClient

logger = logging.getLogger(__name__)

class AutonomousAgent:
    def __init__(self):
        self.test_runner = FakeTestRunner()
        self.code_analyzer = FakeCodeAnalyzer()
        self.llm_client = OllamaClient()
        self.git_client = MockGitClient()
        self.slack_client = MockSlackClient()
        self.jira_client = MockJiraClient()
        
    async def process_commit(self, repository: Repository, commit_event: CommitEvent, job: AgentJob) -> Dict[str, Any]:
        """Main workflow: analyze commit, run tests, propose fixes, create PRs"""
        
        job.logs.append(f"🚀 Starting analysis for commit {commit_event.commit_hash[:8]}")
        
        # Phase 1: Repository Connection & Initial Analysis
        result = await self._phase_1_analysis(repository, commit_event, job)
        
        # Phase 2: Improvements & Optimizations
        if result.get("fixes_applied"):
            improvement_result = await self._phase_2_improvements(repository, commit_event, job)
            result.update(improvement_result)
        
        # Phase 3: Roadmap Awareness
        roadmap_result = await self._phase_3_roadmap(repository, commit_event, job)
        result.update(roadmap_result)
        
        # Send notifications
        await self._send_notifications(repository, result, job)
        
        return result
    
    async def _phase_1_analysis(self, repository: Repository, commit_event: CommitEvent, job: AgentJob) -> Dict[str, Any]:
        """Phase 1: Clone repo, run tests, find errors, propose fixes"""
        
        job.logs.append("📥 Cloning repository...")
        await asyncio.sleep(1)  # Simulate clone time
        
        # Mock clone repository
        clone_result = await self.git_client.clone_repository(repository.url)
        job.logs.append(f"✅ Repository cloned to {clone_result['path']}")
        
        # Run initial tests
        job.logs.append("🧪 Running test suite...")
        test_results = await self.test_runner.run_tests(clone_result['path'])
        
        failed_tests = [t for t in test_results if t.status == "failed"]
        job.logs.append(f"📊 Test Results: {len(test_results)} total, {len(failed_tests)} failed")
        
        result = {
            "phase": "error_detection_and_fixes",
            "test_results": test_results,
            "failed_tests": len(failed_tests),
            "fixes_applied": False,
            "pull_requests": []
        }
        
        if failed_tests:
            # Analyze failed tests and propose fixes
            job.logs.append("🔍 Analyzing failed tests...")
            
            for failed_test in failed_tests:
                job.logs.append(f"🐛 Analyzing failure: {failed_test.test_name}")
                
                # Get LLM analysis and fix
                fix_analysis = await self.llm_client.analyze_test_failure(
                    failed_test.test_name,
                    failed_test.error_message,
                    commit_event.message
                )
                
                job.logs.append(f"🤖 LLM proposed fix for {failed_test.test_name}")
                
                # Apply fix (simulated)
                fix_result = await self.git_client.apply_fix(
                    clone_result['path'],
                    failed_test.test_name,
                    fix_analysis['fix_code']
                )
                
                # Test the fix
                job.logs.append(f"🔄 Testing fix for {failed_test.test_name}...")
                retest_results = await self.test_runner.run_specific_test(
                    clone_result['path'], 
                    failed_test.test_name
                )
                
                if retest_results.status == "passed":
                    job.logs.append(f"✅ Fix successful for {failed_test.test_name}")
                    
                    # Create pull request
                    pr = await self._create_pull_request(
                        repository,
                        f"fix: resolve {failed_test.test_name}",
                        fix_analysis,
                        [retest_results],
                        "bug_fix"
                    )
                    
                    result["pull_requests"].append(pr)
                    result["fixes_applied"] = True
                    
                else:
                    job.logs.append(f"❌ Fix failed for {failed_test.test_name}")
        
        else:
            job.logs.append("✅ All tests passing, looking for optimization opportunities...")
        
        return result
    
    async def _phase_2_improvements(self, repository: Repository, commit_event: CommitEvent, job: AgentJob) -> Dict[str, Any]:
        """Phase 2: Code optimizations and improvements"""
        
        job.logs.append("🚀 Phase 2: Analyzing code for improvements...")
        
        # Analyze code for optimization opportunities
        analysis_results = await self.code_analyzer.analyze_codebase("/tmp/repo")
        
        improvements = []
        
        for analysis in analysis_results:
            if analysis.complexity_score > 7:  # High complexity
                job.logs.append(f"🎯 Found optimization opportunity in {analysis.file_path}")
                
                # Get LLM optimization suggestions
                optimization = await self.llm_client.suggest_optimization(
                    analysis.file_path,
                    analysis.issues,
                    analysis.suggestions
                )
                
                job.logs.append(f"🤖 LLM suggested optimization: {optimization['type']}")
                
                # Apply optimization (simulated)
                await asyncio.sleep(0.5)  # Simulate optimization time
                
                # Test optimization
                test_results = await self.test_runner.run_performance_tests("/tmp/repo")
                
                if optimization['estimated_improvement'] > 15:  # Significant improvement
                    pr = await self._create_pull_request(
                        repository,
                        f"perf: {optimization['title']}",
                        optimization,
                        test_results,
                        "optimization"
                    )
                    
                    improvements.append(pr)
                    job.logs.append(f"✅ Created optimization PR: {pr.title}")
        
        return {
            "phase_2_improvements": len(improvements),
            "optimization_prs": improvements
        }
    
    async def _phase_3_roadmap(self, repository: Repository, commit_event: CommitEvent, job: AgentJob) -> Dict[str, Any]:
        """Phase 3: Roadmap-aware development"""
        
        job.logs.append("🗺️ Phase 3: Checking roadmap alignment...")
        
        # Get upcoming features from Jira
        upcoming_features = await self.jira_client.get_upcoming_features(repository.name)
        
        roadmap_tasks = []
        
        if upcoming_features:
            job.logs.append(f"📋 Found {len(upcoming_features)} upcoming features")
            
            for feature in upcoming_features[:2]:  # Limit to 2 features for demo
                job.logs.append(f"🎯 Analyzing feature: {feature.summary}")
                
                # Check if current changes align with roadmap
                alignment_analysis = await self.llm_client.analyze_roadmap_alignment(
                    commit_event.message,
                    feature.description,
                    feature.summary
                )
                
                if alignment_analysis['alignment_score'] > 0.7:
                    job.logs.append(f"✅ High alignment with {feature.key}")
                    
                    # Suggest preparatory work
                    prep_work = await self.llm_client.suggest_preparatory_work(
                        feature.description,
                        commit_event.message
                    )
                    
                    if prep_work['suggestions']:
                        pr = await self._create_pull_request(
                            repository,
                            f"feat: prepare for {feature.summary}",
                            prep_work,
                            [],
                            "roadmap_preparation"
                        )
                        
                        roadmap_tasks.append(pr)
                        job.logs.append(f"🚀 Created roadmap preparation PR: {pr.title}")
        
        return {
            "phase_3_roadmap": len(roadmap_tasks),
            "roadmap_prs": roadmap_tasks,
            "upcoming_features": len(upcoming_features)
        }
    
    async def _create_pull_request(self, repository: Repository, title: str, analysis: Dict, test_results: List, pr_type: str) -> PullRequest:
        """Create a pull request with analysis and test results"""
        
        pr_id = str(uuid.uuid4())
        branch_name = f"agent/{pr_type}-{uuid.uuid4().hex[:8]}"
        
        # Generate diff based on analysis
        diff = await self.git_client.generate_diff(analysis.get('fix_code', analysis.get('optimization_code', '')))
        
        # Create reasoning section
        reasoning = self._generate_reasoning(analysis, pr_type)
        
        # Format description
        description = self._format_pr_description(analysis, test_results, reasoning, pr_type)
        
        pr = PullRequest(
            id=pr_id,
            title=title,
            description=description,
            branch_name=branch_name,
            diff=diff,
            created_at=datetime.now(),
            status="open",
            reasoning=reasoning,
            test_results=test_results
        )
        
        # "Create" the PR via Git API
        await self.git_client.create_pull_request(repository.url, pr)
        
        return pr
    
    def _generate_reasoning(self, analysis: Dict, pr_type: str) -> str:
        """Generate human-readable reasoning for the PR"""
        
        if pr_type == "bug_fix":
            return f"""
## 🔍 Analysis

I detected a test failure and analyzed the root cause. The issue was in the {analysis.get('affected_component', 'code')} where {analysis.get('problem_description', 'an error occurred')}.

## 🛠️ Solution

{analysis.get('solution_description', 'Applied a targeted fix to resolve the issue.')}

## ✅ Verification

- Reproduced the original failure
- Applied the fix
- Verified all tests now pass
- Confirmed no regression in other components
            """.strip()
        
        elif pr_type == "optimization":
            return f"""
## 📊 Performance Analysis

I identified a performance bottleneck with complexity score {analysis.get('complexity_score', 'high')}. The current implementation has {analysis.get('performance_issue', 'inefficient operations')}.

## 🚀 Optimization

{analysis.get('optimization_description', 'Implemented a more efficient algorithm.')}

## 📈 Expected Impact

- **Performance**: ~{analysis.get('estimated_improvement', 20)}% improvement
- **Scalability**: Better handling of larger datasets
- **Resource Usage**: Reduced memory/CPU consumption
            """.strip()
        
        elif pr_type == "roadmap_preparation":
            return f"""
## 🗺️ Roadmap Alignment

This change prepares the codebase for upcoming feature: {analysis.get('feature_name', 'planned enhancement')}.

## 🎯 Preparation Work

{analysis.get('preparation_description', 'Refactored code to support future requirements.')}

## 🔮 Future Benefits

- Easier implementation of planned features
- Reduced technical debt
- Better code organization
            """.strip()
        
        return "Automated improvement by AI agent."
    
    def _format_pr_description(self, analysis: Dict, test_results: List, reasoning: str, pr_type: str) -> str:
        """Format the complete PR description"""
        
        test_summary = ""
        if test_results:
            passed = len([t for t in test_results if t.status == "passed"])
            total = len(test_results)
            test_summary = f"\n## 🧪 Test Results\n\n✅ {passed}/{total} tests passing\n"
            
            for test in test_results:
                status_emoji = "✅" if test.status == "passed" else "❌"
                test_summary += f"- {status_emoji} {test.test_name} ({test.duration:.2f}s)\n"
        
        return f"""
{reasoning}

{test_summary}

---
*This PR was automatically created by the Autonomous Developer Agent*
        """.strip()
    
    async def _send_notifications(self, repository: Repository, result: Dict, job: AgentJob):
        """Send Slack notifications about the agent's work"""
        
        total_prs = len(result.get("pull_requests", [])) + len(result.get("optimization_prs", [])) + len(result.get("roadmap_prs", []))
        
        if total_prs > 0:
            message = f"🤖 Hey! I just analyzed {repository.name} and created {total_prs} pull request(s):\n"
            
            for pr in result.get("pull_requests", []):
                message += f"• 🐛 {pr.title}\n"
            
            for pr in result.get("optimization_prs", []):
                message += f"• 🚀 {pr.title}\n"
            
            for pr in result.get("roadmap_prs", []):
                message += f"• 🗺️ {pr.title}\n"
            
            message += f"\nCheck them out in the dashboard! 📊"
            
            await self.slack_client.send_notification("#dev-team", message)
            job.logs.append("📱 Sent Slack notification to team")
