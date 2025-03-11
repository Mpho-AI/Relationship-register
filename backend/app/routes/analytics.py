from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Optional
from app.services.auth import get_current_user
from app.models import PrimaryUser, SecondaryUser, Relationship
from sqlalchemy.orm import Session
from app.database import get_db
from datetime import datetime, timedelta
from sqlalchemy.sql import func
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get("/analytics")
async def get_analytics(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get total partners registered
    total_partners = db.query(SecondaryUser).filter(
        SecondaryUser.registered_by == current_user["id"]
    ).count()

    # Get active matches
    active_matches = db.query(Relationship).filter(
        Relationship.primary_user_id == current_user["id"],
        Relationship.status == 'active'
    ).count()

    # Calculate match rate
    total_checks = db.query(SecondaryUser).filter(
        SecondaryUser.registered_by == current_user["id"]
    ).count()
    
    match_rate = (active_matches / total_checks * 100) if total_checks > 0 else 0

    # Get trend data for the last 30 days
    thirty_days_ago = datetime.now() - timedelta(days=30)
    trend_data = db.query(
        Relationship.created_at,
        func.count(Relationship.id)
    ).filter(
        Relationship.primary_user_id == current_user["id"],
        Relationship.created_at >= thirty_days_ago
    ).group_by(
        func.date(Relationship.created_at)
    ).all()

    return {
        "totalPartners": total_partners,
        "activeMatches": active_matches,
        "matchRate": f"{match_rate:.1f}%",
        "trendData": {
            "labels": [date.strftime("%Y-%m-%d") for date, _ in trend_data],
            "datasets": [{
                "label": "New Matches",
                "data": [count for _, count in trend_data],
                "borderColor": "rgb(75, 192, 192)",
                "tension": 0.1
            }]
        }
    } 