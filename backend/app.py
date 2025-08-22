from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional
import asyncio
import json
import uuid
from datetime import datetime
import logging

from agent import AutonomousAgent
from models import Repository, CommitEvent, AgentJob, JobStatus

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Autonomous Developer Agent", version="1.0.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for demo (in production, use a database)
repositories: Dict[str, Repository] = {}
jobs: Dict[str, AgentJob] = {}
agent = AutonomousAgent()

class WebhookPayload(BaseModel):
    repository: Dict
    commits: List[Dict]
    ref: str
    pusher: Dict

class RepositoryConnect(BaseModel):
    repo_url: str
    repo_name: str
    access_token: Optional[str] = None

@app.get("/")
async def root():
    return {"message": "Autonomous Developer Agent API", "status": "running"}

@app.get("/repositories")
async def get_repositories():
    """Get all connected repositories"""
    return {"repositories": list(repositories.values())}

@app.post("/repositories/connect")
async def connect_repository(repo_data: RepositoryConnect):
    """Connect a new repository to the agent"""
    repo_id = str(uuid.uuid4())
    
    repository = Repository(
        id=repo_id,
        name=repo_data.repo_name,
        url=repo_data.repo_url,
        connected_at=datetime.now(),
        status="connected"
    )
    
    repositories[repo_id] = repository
    
    logger.info(f"Connected repository: {repo_data.repo_name}")
    
    return {"message": "Repository connected successfully", "repository": repository}

@app.post("/webhook/github")
async def github_webhook(payload: WebhookPayload, background_tasks: BackgroundTasks):
    """Handle GitHub webhook events"""
    repo_name = payload.repository.get("full_name", "unknown/repo")
    
    # Find connected repository
    repo = None
    for r in repositories.values():
        if repo_name in r.url or r.name == repo_name:
            repo = r
            break
    
    if not repo:
        raise HTTPException(status_code=404, detail="Repository not connected")
    
    # Create commit event
    commit_event = CommitEvent(
        repository_id=repo.id,
        commit_hash=payload.commits[0]["id"] if payload.commits else "unknown",
        author=payload.commits[0]["author"]["name"] if payload.commits else "unknown",
        message=payload.commits[0]["message"] if payload.commits else "No message",
        timestamp=datetime.now()
    )
    
    # Start agent job in background
    background_tasks.add_task(process_commit, repo, commit_event)
    
    return {"message": "Webhook received, processing commit"}

@app.post("/demo/trigger-commit")
async def trigger_demo_commit(background_tasks: BackgroundTasks):
    """Manually trigger a commit event for demo purposes"""
    if not repositories:
        raise HTTPException(status_code=400, detail="No repositories connected")
    
    # Use the first connected repository
    repo = list(repositories.values())[0]
    
    commit_event = CommitEvent(
        repository_id=repo.id,
        commit_hash=f"demo-{uuid.uuid4().hex[:8]}",
        author="Demo Developer",
        message="feat: add new feature with potential issues",
        timestamp=datetime.now()
    )
    
    # Start agent job in background
    background_tasks.add_task(process_commit, repo, commit_event)
    
    return {"message": "Demo commit triggered", "commit": commit_event}

async def process_commit(repository: Repository, commit_event: CommitEvent):
    """Process a commit event with the autonomous agent"""
    job_id = str(uuid.uuid4())
    
    job = AgentJob(
        id=job_id,
        repository_id=repository.id,
        commit_hash=commit_event.commit_hash,
        status=JobStatus.RUNNING,
        created_at=datetime.now(),
        logs=[]
    )
    
    jobs[job_id] = job
    
    try:
        # Run the autonomous agent
        result = await agent.process_commit(repository, commit_event, job)
        
        job.status = JobStatus.COMPLETED
        job.completed_at = datetime.now()
        job.result = result
        
        logger.info(f"Job {job_id} completed successfully")
        
    except Exception as e:
        job.status = JobStatus.FAILED
        job.error = str(e)
        job.completed_at = datetime.now()
        
        logger.error(f"Job {job_id} failed: {str(e)}")

@app.get("/jobs")
async def get_jobs():
    """Get all agent jobs"""
    return {"jobs": list(jobs.values())}

@app.get("/jobs/{job_id}")
async def get_job(job_id: str):
    """Get a specific job by ID"""
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return {"job": jobs[job_id]}

@app.get("/dashboard/stats")
async def get_dashboard_stats():
    """Get dashboard statistics"""
    total_repos = len(repositories)
    total_jobs = len(jobs)
    completed_jobs = len([j for j in jobs.values() if j.status == JobStatus.COMPLETED])
    failed_jobs = len([j for j in jobs.values() if j.status == JobStatus.FAILED])
    
    return {
        "total_repositories": total_repos,
        "total_jobs": total_jobs,
        "completed_jobs": completed_jobs,
        "failed_jobs": failed_jobs,
        "success_rate": (completed_jobs / total_jobs * 100) if total_jobs > 0 else 0
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
