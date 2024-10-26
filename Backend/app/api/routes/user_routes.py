from fastapi import APIRouter, Depends, HTTPException, status
from fastapi_pagination import Params
from sqlalchemy.orm import Session
from app.services.user_service import UserService
from app.schemas.user import (EmployerCreate, User, EmployeeCreate, EmployeeOutput, EmployerOutput,
                              AdminOutput, ProfileInput, UserDeactivateRequest)
from app.schemas.token import Token
from app.auth.jwt import create_access_token, verify_token
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi_pagination import Page
from app.api.dependencies import get_db, get_current_user
from app.api.dependencies import role_required
from app.db.models import UserRole

router = APIRouter()

@router.post("/employer_register", response_model=User)
def register(user: EmployerCreate, db: Session = Depends(get_db)):
    user_service = UserService(db)
    db_user = user_service.create_employer(user)
    return db_user

@router.post("/employee_register", response_model=User)
def register(user: EmployeeCreate, db: Session = Depends(get_db)):
    user_service = UserService(db)
    db_user = user_service.create_employee(user)
    return db_user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user_service = UserService(db)
    user = user_service.authenticate_user(form_data.username, form_data.password)
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
    access_token = create_access_token(data={"user_id":user.id,"email": user.email, "first_name": user.first_name,
                                             "title":user.title, "last_name":user.last_name,
                                             "role":user.role.value, "code":user.employer_code})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/employees", response_model=Page[EmployeeOutput], dependencies=[Depends(role_required([UserRole.EMPLOYER]))],
            description="Required: EMPLOYER, get employees under an employer")
def list_users(db: Session = Depends(get_db), current_user: User = Depends(get_current_user),
               page:int | None = 1, size:int |None = 10):
    param = Params(page=page, size=size)
    user_service = UserService(db)
    return user_service.get_employees(current_user, param)

@router.get("/employers", response_model=Page[EmployerOutput], dependencies=[Depends(role_required([UserRole.ADMIN]))],
            description="Required: ADMIN, get all employers")
def list_users(db: Session = Depends(get_db), current_user: User = Depends(get_current_user),
               page:int | None = 1, size:int |None = 10):
    param = Params(page=page, size=size)
    user_service = UserService(db)
    return user_service.get_employers(current_user, param)

@router.delete("/employees", dependencies=[Depends(role_required([UserRole.EMPLOYER, UserRole.ADMIN]))],
               description="Required: EMPLOYER | ADMIN, Deactivate list of employees")
def deactivate_users_list(users: UserDeactivateRequest, db:Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user_service = UserService(db)
    return user_service.deactivate_users(users)

@router.get("/profile",  response_model=EmployeeOutput, description="Get current user's profile")
def read_profile(db: Session = Depends(get_db), current_user: EmployeeOutput = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=EmployeeOutput, description="Update current user's profile")
def update_profile_request(user_profile: ProfileInput ,db: Session = Depends(get_db), current_user: EmployeeOutput = Depends(get_current_user)):
    user_service = UserService(db)
    return user_service.update_profile(current_user, user_profile)