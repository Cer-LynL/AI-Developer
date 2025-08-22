from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class JobStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"

class Repository(BaseModel):
    id: str
    name: str
    url: str
    connected_at: datetime
    status: str
    last_commit: Optional[str] = None
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class CommitEvent(BaseModel):
    repository_id: str
    commit_hash: str
    author: str
    message: str
    timestamp: datetime
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class AgentJob(BaseModel):
    id: str
    repository_id: str
    commit_hash: str
    status: JobStatus
    created_at: datetime
    completed_at: Optional[datetime] = None
    logs: List[str] = []
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class TestResult(BaseModel):
    test_name: str
    status: str  # "passed", "failed", "skipped"
    duration: float
    error_message: Optional[str] = None

class CodeAnalysis(BaseModel):
    file_path: str
    issues: List[Dict[str, Any]]
    suggestions: List[str]
    complexity_score: int

class PullRequest(BaseModel):
    id: str
    title: str
    description: str
    branch_name: str
    diff: str
    created_at: datetime
    status: str  # "open", "merged", "closed"
    reasoning: str
    test_results: List[TestResult]
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class SlackNotification(BaseModel):
    channel: str
    message: str
    attachments: Optional[List[Dict[str, Any]]] = None
    timestamp: datetime
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class JiraTicket(BaseModel):
    key: str
    summary: str
    description: str
    status: str
    assignee: Optional[str] = None
    priority: str
    created_at: datetime
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
