from pydantic import BaseModel, EmailStr

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
        orm_mode = True


class EmployeeOutput(BaseModel):
    id: int
    title: str
    first_name: str
    last_name: str
    email: EmailStr
    phone_number: str
    role: str
    parent_user_id: int

    class Config:
        from_attribute = True