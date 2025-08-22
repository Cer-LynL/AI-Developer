import asyncio
from typing import Dict, List, Any
from datetime import datetime

from models import SlackNotification

class MockSlackClient:
    """Mock Slack client that simulates Slack webhook integrations"""
    
    def __init__(self):
        self.webhook_url = "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
        self.sent_notifications = []
        
    async def send_notification(self, channel: str, message: str, attachments: List[Dict] = None) -> Dict[str, Any]:
        """Simulate sending a Slack notification"""
        await asyncio.sleep(0.3)  # Simulate API call time
        
        notification = SlackNotification(
            channel=channel,
            message=message,
            attachments=attachments or [],
            timestamp=datetime.now()
        )
        
        self.sent_notifications.append(notification)
        
        return {
            "status": "success",
            "channel": channel,
            "message_id": f"slack-{len(self.sent_notifications)}",
            "timestamp": notification.timestamp.isoformat()
        }
    
    async def send_pr_notification(self, channel: str, pr_title: str, pr_url: str, pr_type: str) -> Dict[str, Any]:
        """Send a formatted PR notification to Slack"""
        
        # Choose emoji based on PR type
        emoji_map = {
            "bug_fix": "🐛",
            "optimization": "🚀", 
            "roadmap_preparation": "🗺️"
        }
        
        emoji = emoji_map.get(pr_type, "🔧")
        
        message = f"{emoji} *New Pull Request Created*\n"
        message += f"*Title:* {pr_title}\n"
        message += f"*Type:* {pr_type.replace('_', ' ').title()}\n"
        message += f"*Link:* <{pr_url}|View PR>\n"
        message += f"*Created by:* Autonomous Developer Agent"
        
        attachments = [
            {
                "color": "good" if pr_type == "bug_fix" else "warning",
                "fields": [
                    {
                        "title": "Status",
                        "value": "Ready for Review",
                        "short": True
                    },
                    {
                        "title": "Automated",
                        "value": "Yes",
                        "short": True
                    }
                ]
            }
        ]
        
        return await self.send_notification(channel, message, attachments)
    
    async def send_job_completion(self, channel: str, repo_name: str, job_stats: Dict) -> Dict[str, Any]:
        """Send job completion notification"""
        
        total_prs = job_stats.get("total_prs", 0)
        fixes = job_stats.get("fixes", 0)
        optimizations = job_stats.get("optimizations", 0)
        
        message = f"🤖 *Agent Analysis Complete*\n"
        message += f"*Repository:* {repo_name}\n"
        message += f"*Pull Requests Created:* {total_prs}\n"
        
        if fixes > 0:
            message += f"• 🐛 Bug fixes: {fixes}\n"
        if optimizations > 0:
            message += f"• 🚀 Optimizations: {optimizations}\n"
        
        message += f"\nCheck the dashboard for details! 📊"
        
        return await self.send_notification(channel, message)
    
    async def send_error_notification(self, channel: str, error_message: str, repo_name: str) -> Dict[str, Any]:
        """Send error notification"""
        
        message = f"⚠️ *Agent Error*\n"
        message += f"*Repository:* {repo_name}\n"
        message += f"*Error:* {error_message}\n"
        message += f"*Status:* Investigation needed"
        
        attachments = [
            {
                "color": "danger",
                "fields": [
                    {
                        "title": "Action Required",
                        "value": "Manual review needed",
                        "short": True
                    }
                ]
            }
        ]
        
        return await self.send_notification(channel, message, attachments)
    
    async def get_channel_info(self, channel: str) -> Dict[str, Any]:
        """Get channel information"""
        await asyncio.sleep(0.1)
        
        return {
            "channel": channel,
            "name": channel.replace("#", ""),
            "members": 12,
            "purpose": "Development team notifications",
            "is_active": True
        }
    
    def get_sent_notifications(self) -> List[SlackNotification]:
        """Get all sent notifications for demo purposes"""
        return self.sent_notifications
    
    async def health_check(self) -> Dict[str, Any]:
        """Check Slack integration health"""
        await asyncio.sleep(0.1)
        
        return {
            "status": "healthy",
            "webhook_configured": True,
            "notifications_sent": len(self.sent_notifications),
            "last_notification": self.sent_notifications[-1].timestamp.isoformat() if self.sent_notifications else None
        }
