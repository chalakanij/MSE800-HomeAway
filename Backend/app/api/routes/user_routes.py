from fastapi import APIRouter, Depends, HTTPException, status
from fastapi_pagination import Params
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.services.user_service import (create_employer, authenticate_user, get_employees,
                                       create_employee, deactivate_users, update_profile, get_employers)
from app.schemas.user import (EmployerCreate, User, EmployeeCreate, EmployeeOutput, EmployerOutput,
                              AdminOutput, ProfileInput, UserDeactivateRequest)
from app.schemas.token import Token
from app.auth.jwt import create_access_token, verify_token
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.db.models import User as UserModel
from fastapi_pagination import Page
from app.api.dependencies import get_db
from typing import List

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

router = APIRouter()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    token_data = verify_token(token, credentials_exception)
    user = db.query(UserModel).filter(UserModel.email == token_data.email).first()
    if user is None:
        raise credentials_exception
    return user

@router.post("/employer_register", response_model=User)
def register(user: EmployerCreate, db: Session = Depends(get_db)):
    db_user = create_employer(db, user)
    return db_user

@router.post("/employee_register", response_model=User)
def register(user: EmployeeCreate, db: Session = Depends(get_db)):
    db_user = create_employee(db, user)
    return db_user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password) 
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if user.active == 0:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User is not active.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"email": user.email, "first_name": user.first_name,
                                             "title":user.title, "last_name":user.last_name, "role":user.role.value})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/employees", response_model=Page[EmployeeOutput])
def list_users(db: Session = Depends(get_db), current_user: User = Depends(get_current_user),
               page:int | None = 1, size:int |None = 10):
    param = Params(page=page, size=size)
    return get_employees(db, current_user, param)

@router.get("/employers", response_model=Page[EmployerOutput])
def list_users(db: Session = Depends(get_db), current_user: User = Depends(get_current_user),
               page:int | None = 1, size:int |None = 10):
    param = Params(page=page, size=size)
    return get_employers(db, current_user, param)

@router.delete("/employees")
def deactivate_users_list(users: UserDeactivateRequest, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return deactivate_users(db, users)

@router.get("/profile",  response_model=EmployeeOutput)
def read_profile(db: Session = Depends(get_db), current_user: EmployeeOutput = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=EmployeeOutput)
def update_profile_request(user_profile: ProfileInput ,db: Session = Depends(get_db), current_user: EmployeeOutput = Depends(get_current_user)):
    return update_profile(db, current_user, user_profile)