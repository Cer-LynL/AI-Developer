import asyncio
import random
from typing import Dict, List, Any
from datetime import datetime, timedelta

from models import JiraTicket

class MockJiraClient:
    """Mock Jira client that simulates Jira API interactions"""
    
    def __init__(self):
        self.base_url = "https://demo-company.atlassian.net"
        self.demo_tickets = self._generate_demo_tickets()
        
    def _generate_demo_tickets(self) -> List[JiraTicket]:
        """Generate demo Jira tickets for roadmap simulation"""
        
        tickets = [
            JiraTicket(
                key="PROJ-123",
                summary="Enhanced User Authentication System",
                description="Implement multi-factor authentication and SSO integration for improved security. This includes OAuth2 support, SAML integration, and biometric authentication options.",
                status="To Do",
                assignee="john.doe@company.com",
                priority="High",
                created_at=datetime.now() - timedelta(days=5)
            ),
            JiraTicket(
                key="PROJ-124", 
                summary="Performance Optimization for Data Processing",
                description="Optimize the data processing pipeline to handle larger datasets more efficiently. Focus on reducing memory usage and improving query performance.",
                status="In Progress",
                assignee="jane.smith@company.com",
                priority="Medium",
                created_at=datetime.now() - timedelta(days=3)
            ),
            JiraTicket(
                key="PROJ-125",
                summary="Real-time Notification System",
                description="Build a real-time notification system using WebSockets to provide instant updates to users about important events and changes.",
                status="To Do",
                assignee="mike.johnson@company.com", 
                priority="Medium",
                created_at=datetime.now() - timedelta(days=2)
            ),
            JiraTicket(
                key="PROJ-126",
                summary="Advanced Analytics Dashboard",
                description="Create an advanced analytics dashboard with customizable widgets, real-time metrics, and export capabilities for business intelligence.",
                status="To Do",
                assignee=None,
                priority="Low",
                created_at=datetime.now() - timedelta(days=1)
            ),
            JiraTicket(
                key="PROJ-127",
                summary="API Rate Limiting and Throttling",
                description="Implement comprehensive API rate limiting and throttling mechanisms to prevent abuse and ensure fair usage across all clients.",
                status="To Do",
                assignee="sarah.wilson@company.com",
                priority="High",
                created_at=datetime.now()
            )
        ]
        
        return tickets
    
    async def get_upcoming_features(self, repo_name: str) -> List[JiraTicket]:
        """Get upcoming features from Jira that might be relevant to the repository"""
        await asyncio.sleep(0.5)  # Simulate API call time
        
        # Filter tickets that might be relevant to the repository
        # In a real implementation, this would use more sophisticated matching
        relevant_tickets = []
        
        for ticket in self.demo_tickets:
            if ticket.status in ["To Do", "In Progress"]:
                # Add some randomness to make it more realistic
                if random.random() > 0.3:  # 70% chance of being relevant
                    relevant_tickets.append(ticket)
        
        return relevant_tickets[:3]  # Return top 3 for demo
    
    async def get_ticket_details(self, ticket_key: str) -> JiraTicket:
        """Get detailed information about a specific ticket"""
        await asyncio.sleep(0.3)
        
        # Find the ticket by key
        for ticket in self.demo_tickets:
            if ticket.key == ticket_key:
                return ticket
        
        # Return a default ticket if not found
        return JiraTicket(
            key=ticket_key,
            summary="Unknown Ticket",
            description="Ticket details not available",
            status="Unknown",
            priority="Medium",
            created_at=datetime.now()
        )
    
    async def create_ticket(self, summary: str, description: str, priority: str = "Medium") -> JiraTicket:
        """Create a new Jira ticket (simulated)"""
        await asyncio.sleep(0.7)
        
        ticket_number = len(self.demo_tickets) + 1
        new_ticket = JiraTicket(
            key=f"PROJ-{127 + ticket_number}",
            summary=summary,
            description=description,
            status="To Do",
            priority=priority,
            created_at=datetime.now()
        )
        
        self.demo_tickets.append(new_ticket)
        return new_ticket
    
    async def update_ticket_status(self, ticket_key: str, new_status: str) -> Dict[str, Any]:
        """Update the status of a Jira ticket"""
        await asyncio.sleep(0.4)
        
        for ticket in self.demo_tickets:
            if ticket.key == ticket_key:
                old_status = ticket.status
                ticket.status = new_status
                
                return {
                    "status": "success",
                    "ticket_key": ticket_key,
                    "old_status": old_status,
                    "new_status": new_status,
                    "updated_at": datetime.now().isoformat()
                }
        
        return {
            "status": "error",
            "message": f"Ticket {ticket_key} not found"
        }
    
    async def search_tickets(self, query: str, project: str = "PROJ") -> List[JiraTicket]:
        """Search for tickets matching a query"""
        await asyncio.sleep(0.6)
        
        query_lower = query.lower()
        matching_tickets = []
        
        for ticket in self.demo_tickets:
            if (query_lower in ticket.summary.lower() or 
                query_lower in ticket.description.lower()):
                matching_tickets.append(ticket)
        
        return matching_tickets
    
    async def get_project_stats(self, project_key: str = "PROJ") -> Dict[str, Any]:
        """Get project statistics"""
        await asyncio.sleep(0.3)
        
        total_tickets = len(self.demo_tickets)
        status_counts = {}
        priority_counts = {}
        
        for ticket in self.demo_tickets:
            # Count by status
            status_counts[ticket.status] = status_counts.get(ticket.status, 0) + 1
            # Count by priority
            priority_counts[ticket.priority] = priority_counts.get(ticket.priority, 0) + 1
        
        return {
            "project_key": project_key,
            "total_tickets": total_tickets,
            "status_breakdown": status_counts,
            "priority_breakdown": priority_counts,
            "active_tickets": status_counts.get("In Progress", 0),
            "backlog_tickets": status_counts.get("To Do", 0),
            "completed_tickets": status_counts.get("Done", 0)
        }
    
    async def get_roadmap_items(self, timeframe_days: int = 30) -> List[Dict[str, Any]]:
        """Get roadmap items for the specified timeframe"""
        await asyncio.sleep(0.4)
        
        # Filter tickets that are planned for the near future
        cutoff_date = datetime.now() + timedelta(days=timeframe_days)
        
        roadmap_items = []
        for ticket in self.demo_tickets:
            if ticket.status in ["To Do", "In Progress"]:
                # Simulate planned completion dates
                planned_date = ticket.created_at + timedelta(days=random.randint(7, 45))
                
                if planned_date <= cutoff_date:
                    roadmap_items.append({
                        "ticket": ticket,
                        "planned_completion": planned_date,
                        "estimated_effort": f"{random.randint(3, 21)} days",
                        "dependencies": random.randint(0, 2),
                        "risk_level": random.choice(["Low", "Medium", "High"])
                    })
        
        # Sort by planned completion date
        roadmap_items.sort(key=lambda x: x["planned_completion"])
        
        return roadmap_items
    
    async def health_check(self) -> Dict[str, Any]:
        """Check Jira integration health"""
        await asyncio.sleep(0.1)
        
        return {
            "status": "healthy",
            "base_url": self.base_url,
            "total_tickets": len(self.demo_tickets),
            "connection": "active",
            "last_sync": datetime.now().isoformat()
        }
    
    def get_all_tickets(self) -> List[JiraTicket]:
        """Get all tickets for demo purposes"""
        return self.demo_tickets
