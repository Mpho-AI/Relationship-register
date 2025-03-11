from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import uuid

Base = declarative_base()

class PrimaryUser(Base):
    __tablename__ = "primary_users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String(255), nullable=False)
    age = Column(Integer)
    city = Column(String(255))
    profile_image = Column(String)
    relationship_status = Column(String(10))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    __table_args__ = (
        CheckConstraint(
            relationship_status.in_(['monogamy', 'polygamy']),
            name='valid_relationship_status'
        ),
    )

class SecondaryUser(Base):
    __tablename__ = "secondary_users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    registered_by = Column(UUID(as_uuid=True), ForeignKey('primary_users.id', ondelete='CASCADE'))
    full_name = Column(String(255))
    age = Column(Integer)
    city = Column(String(255))
    car = Column(String(255))
    location = Column(String)
    number_of_kids = Column(Integer)
    profile_image = Column(String)
    partner_image = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow) 