from sqlalchemy import Boolean, Column, Integer, String, Enum
from database import Base

class UserRole(Enum):
    ADMIN = "ADMIN"
    EMPLOYER = "EMPLOYER"
    EMPLOYEE = "EMPLOYEE"

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(10))
    first_name = Column(String(50))
    last_name = Column(String(50))
    email = Column(String(100))
    phone_number = Column(String(20))
    password = Column(String(200))
    role = Column(Enum(UserRole), default=UserRole.EMPLOYEE)

