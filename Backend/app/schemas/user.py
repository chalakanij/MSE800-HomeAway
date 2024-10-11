from pydantic import BaseModel, EmailStr

class EmployeeCreate(BaseModel):
    title: str
    first_name: str
    last_name: str
    email: EmailStr
    phone_number: str
    password: str

class EmployerCreate(EmployeeCreate):
    company_name: str
    
class AdminCreate(EmployeeCreate):
    pass

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
    
    class Config:
        orm_mode = True
