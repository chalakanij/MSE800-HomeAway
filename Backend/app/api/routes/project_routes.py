from fastapi import APIRouter, Depends, HTTPException, status, Path
from fastapi_pagination import Params, add_pagination
from fastapi_pagination.iterables import LimitOffsetPage
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.services.project_service import create_project, get_employer_projects, assign_employees, get_assigned_projects
from app.schemas.user import User
from app.schemas.project import Project, ProjectCreate, ProjectOutput, ProjectEmployeeCreate, ProjectEmployeeOutput
from app.schemas.token import Token
from app.auth.jwt import create_access_token, verify_token
from app.db import SessionLocal
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.db.models import User as UserModel
from fastapi_pagination import Page
from app.api.dependencies import get_db
from app.api.routes.user_routes import get_current_user
from typing import Annotated


router = APIRouter()


@router.post("/projects", response_model=Project)
def register(project: ProjectCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_project = create_project(db, project, current_user)
    return db_project

@router.get("/projects", response_model=Page[ProjectOutput])
def get_projects(db: Session = Depends(get_db), current_user: User = Depends(get_current_user),
               page:int | None = 1, size:int |None = 10):
    param = Params(page=page, size=size)
    return get_employer_projects(db, current_user, param)

@router.post("/projects/users/{project_id}", response_model=ProjectEmployeeOutput)
def assign_employees_to_project(db: Session = Depends(get_db), current_user: User = Depends(get_current_user),
             employees: ProjectEmployeeCreate = None,
             project_id: int = Path()):
    db_project = assign_employees(db, project_id, employees, current_user)
    return db_project

@router.get("/projects/users/{project_id}", response_model=Page[ProjectEmployeeOutput])
def get_employees_in_project(db: Session = Depends(get_db), project_id: int = Path(), current_user: User = Depends(get_current_user),
               page:int | None = 1, size:int |None = 10):
    param = Params(page=page, size=size)
    return get_assigned_projects(db, project_id, current_user, param)