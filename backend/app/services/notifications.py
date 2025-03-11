from fastapi import BackgroundTasks, HTTPException
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from twilio.rest import Client
import os
from typing import Optional
from pydantic import EmailStr  # For email validation

class NotificationService:
    def __init__(self):
        self.sendgrid = SendGridAPIClient(os.getenv('SENDGRID_API_KEY'))
        self.twilio = Client(
            os.getenv('TWILIO_ACCOUNT_SID'),
            os.getenv('TWILIO_AUTH_TOKEN')
        )

    async def send_email(self, to_email: str, subject: str, content: str):
        message = Mail(
            from_email='noreply@relationshipregister.com',
            to_emails=to_email,
            subject=subject,
            html_content=content
        )
        try:
            await self.sendgrid.send(message)
            return True
        except Exception as e:
            print(f"Email error: {e}")
            return False

    async def send_sms(self, to_number: str, message: str):
        try:
            self.twilio.messages.create(
                body=message,
                from_=os.getenv('TWILIO_PHONE_NUMBER'),
                to=to_number
            )
            return True
        except Exception as e:
            print(f"SMS error: {e}")
            return False

    async def notify_match(self, user_email: str, user_phone: str, match_details: dict):
        # Send both email and SMS notifications
        email_content = f"""
        <h2>Important: Similar Profile Found</h2>
        <p>We found a profile that matches your registered partner with {match_details['similarity']}% similarity.</p>
        <p>Please check your dashboard for more details.</p>
        """
        sms_content = f"Alert: A profile matching your partner ({match_details['similarity']}% similarity) has been found. Check your dashboard."
        
        background_tasks = BackgroundTasks()
        background_tasks.add_task(self.send_email, user_email, "Match Alert", email_content)
        background_tasks.add_task(self.send_sms, user_phone, sms_content) 