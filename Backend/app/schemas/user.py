from pydantic import BaseModel, EmailStr
from typing import Optional, List

class AdminCreate(BaseModel):
    title: str
    first_name: str
    last_name: str
    email: EmailStr
    phone_number: str
    password: str

class EmployerCreate(AdminCreate):
    company_name: str
    
class EmployeeCreate(AdminCreate):
    employer_code: str

class User(BaseModel):
    id: int
    title: str
    first_name: str
    last_name: str
    company_name: str
    employer_code: str
    email: EmailStr
    phone_number: str
    hashed_password: str
    role: str
    parent_user_id: int
    
    class Config:
        from_attributes = True

class AdminOutput(BaseModel):
    id: int
    title: str
    first_name: str
    last_name: str
    email: EmailStr
    phone_number: str
    role: str
    active: int

    class Config:
        from_attributes = True


class EmployeeOutput(AdminOutput):
    parent_user_id: Optional[int] = None
    company_name: str

class EmployerOutput(EmployeeOutput):
    pass

class ProfileInput(BaseModel):
    title: str
    first_name: str
    last_name: str
    phone_number: str
    company_name: Optional[str] =None

class UserDeactivateRequest(BaseModel):
    user_id : List[int]
