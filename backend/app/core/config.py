from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Relationship Register"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "your-secret-key"  # In production, use environment variable
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS Settings
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    
    # Database URLs
    POSTGRES_URL: str = "postgresql://user:password@db/relationship_db"
    REDIS_URL: str = "redis://redis:6379/0"
    NEO4J_URL: str = "bolt://neo4j:7687"
    
    # External Services
    SENDGRID_API_KEY: str = ""
    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""
    
    # Face Recognition
    FACE_SIMILARITY_THRESHOLD: float = 0.90
    FACE_MODEL_NAME: str = "VGG-Face"

    class Config:
        case_sensitive = True

settings = Settings() 