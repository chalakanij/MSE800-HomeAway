from datetime import datetime
import re

from sqlalchemy.orm import Session, aliased
from sqlalchemy import select, update
from app.db.models import User, UserRole
from app.schemas.user import (EmployerCreate, EmployeeCreate, AdminCreate, EmployeeOutput,
                              ProfileInput, UserDeactivateRequest)
from app.utils.hashing import hash_password, verify_password
from fastapi import HTTPException
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate

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

def get_employees(db: Session, current_user, params):
    #due to get the company_name from parent record, table need to join and get correct fields only
    ParentUser = aliased(User)
    users_query = (
        select(User, ParentUser.company_name)
        .join(ParentUser, User.parent_user_id == ParentUser.id)
        .filter(User.parent_user_id == current_user.id)
        .order_by(User.id)
    )

    paginated_data = paginate(db, users_query, params)

    # Convert results to Pydantic model instances
    response = [
        EmployeeOutput(
            id=user.id,
            title=user.title,
            first_name=user.first_name,
            last_name=user.last_name,
            email=user.email,
            phone_number=user.phone_number,
            role=user.role,
            active=user.active,
            parent_user_id=user.parent_user_id,
            company_name=parent_user_company_name
        )
        for user, parent_user_company_name in paginated_data.items
    ]

    return {
        "items": response,
        "total": paginated_data.total,
        "page": paginated_data.page,
        "size": paginated_data.size
    }

def get_employers(db: Session, current_user, params):
    return paginate(db, select(User).filter(User.role == UserRole.EMPLOYER).filter(User.Active == 1), params)

def deactivate_users(db: Session, users: UserDeactivateRequest):
    affected_rows = db.query(User).filter(User.id.in_(users.user_id)).update({"active": 0}, synchronize_session=False)
    db.commit()
    return {"message": f"Updated {affected_rows} users."}


def update_profile(db: Session, current_user: User, profile_update: ProfileInput):

    user = db.query(User).filter(User.id == current_user.id).first()

    if profile_update.title is not None:
        user.title = profile_update.title
    if profile_update.first_name is not None:
        user.first_name = profile_update.first_name
    if profile_update.last_name is not None:
        user.last_name = profile_update.last_name
    if profile_update.phone_number is not None:
        user.phone_number = profile_update.phone_number
    if profile_update.company_name is not None:
        user.company_name = profile_update.company_name
    db.commit()
    db.refresh(user)
    return user