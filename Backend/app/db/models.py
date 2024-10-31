from sqlalchemy import Column, Integer, String, Enum, DateTime, Text, ForeignKey
from sqlalchemy.orm import declarative_base
from enum import Enum as BaseEnum
import datetime

Base = declarative_base()

class UserRole(BaseEnum):
    ADMIN = "ADMIN"
    EMPLOYER = "EMPLOYER"
    EMPLOYEE = "EMPLOYEE"
    
class ProjectStatus(BaseEnum):
    INITIAL = "INITIAL"
    STARTED = "STARTED"
    ONGOING = "ONGOING"
    COMPLETED = "COMPLETED"
    HALT = "HALT"
    DELETED = "DELETED"

class CheckInOutStatus(BaseEnum):
    INITIAL = 0
    CHECKIN = 1
    CHECKOUT = 2

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(10))
    first_name = Column(String(50))
    last_name = Column(String(50))
    company_name = Column(String(100), nullable=True, default="")
    employer_code = Column(String(40), default="")
    email = Column(String(100), unique=True)
    phone_number = Column(String(20))
    hashed_password = Column(String(200))
    role = Column(Enum(UserRole), default=UserRole.EMPLOYEE)
    active = Column(Integer, default=1)
    parent_user_id = Column(Integer, nullable=True)
    
class Project(Base):
    __tablename__ = 'projects'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), index=True, nullable=False) #employer ID
    title = Column(String(100))
    description = Column(Text)
    work_hours = Column(Integer, default=0)
    status = Column(Enum(ProjectStatus), default=ProjectStatus.INITIAL)
    
    
class CheckInOut(Base):
    __tablename__ = 'checkinout'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'),  index=True, nullable=False)
    status = Column(Enum(CheckInOutStatus), default=CheckInOutStatus.INITIAL)
    in_time = Column(DateTime, nullable=False)
    out_time = Column(DateTime, nullable=True, default=None)
    description = Column(Text)
    project_id = Column(Integer, ForeignKey('projects.id'))

    
class UserProject(Base):
    __tablename__ = 'user_projects'
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey('projects.id'), index=True, nullable=False)
    employee_id = Column(Integer, ForeignKey('users.id'), index=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now())
    
    