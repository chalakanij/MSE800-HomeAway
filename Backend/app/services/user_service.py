from datetime import datetime
import re

from sqlalchemy.orm import Session
from app.db.models import User, UserRole
from app.schemas.user import EmployerCreate, EmployeeCreate, AdminCreate
from app.utils.hashing import hash_password, verify_password
from fastapi import HTTPException


def _generate_company_code(company_name):
    COMPANY_CODE_LENGTH = 8
    if re.search(r"\s", company_name):
        first, second = company_name.upper().rsplit(maxsplit=1)
        code = first[0:3] + second[0:3]
    else:
        code = company_name[0:5]

    code = code + datetime.now().strftime("%M%S%f")

    return code[:COMPANY_CODE_LENGTH]

def create_employer(db: Session, user: EmployerCreate):
    hashed_password = hash_password(user.password)
    user_input = user.dict()
    del user_input['password']
    user_input['role'] = UserRole.EMPLOYER
    user_input['employer_code'] = _generate_company_code(user_input['company_name'])
    user_input['parent_user_id'] = 0
    db_user = User(**user_input, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# check the employer code
def _get_employer_by_code(db: Session, code):
    user = db.query(User).filter(User.employer_code == code).first()
    if user:
        return user
    return None

def create_employee(db: Session, user: EmployeeCreate):
    hashed_password = hash_password(user.password)
    user_input = user.dict()
    employer = _get_employer_by_code(db, user_input['employer_code'])
    print (employer)
    if employer is None:
        raise HTTPException(status_code=404, detail="Invalid Employer Code!")
    del user_input['password']
    user_input['role'] = UserRole.EMPLOYEE
    user_input['company_name'] = ''
    user_input['parent_user_id'] = employer.id
    db_user = User(**user_input, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_admin(db: Session, user: AdminCreate):
    hashed_password = hash_password(user.password)
    user_input = user.dict()
    del user_input['password']
    user_input['role'] = UserRole.ADMIN
    user_input['company_name'] = ''
    user_input['employer_code'] = ''
    user_input['parent_user_id'] = 0
    db_user = User(**user_input, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if user and verify_password(password, user.hashed_password):
        return user
    return None

def get_users(db: Session, current_user):
    return db.query(User).filter(User.parent_user_id == current_user.id).all()
