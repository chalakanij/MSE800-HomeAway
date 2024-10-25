from fastapi import APIRouter, Depends, HTTPException, status, Path
from fastapi_pagination import Params, add_pagination
from fastapi_pagination.iterables import LimitOffsetPage
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.services.project_service import ProjectService
from app.schemas.user import User
from app.schemas.project import (Project, ProjectCreate, ProjectOutput, ProjectEmployeeCreate,
                                 ProjectEmployeeOutput, ProjectUpdateRequest)
from app.schemas.token import Token
from app.auth.jwt import create_access_token, verify_token
from app.db import SessionLocal
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.db.models import User as UserModel
from fastapi_pagination import Page
from app.api.dependencies import get_db
from app.api.dependencies import get_current_user
from typing import Annotated, List
from app.api.dependencies import role_required
from app.db.models import UserRole

router = APIRouter()


@router.post("/projects", response_model=Project, dependencies=[Depends(role_required([UserRole.EMPLOYER]))])
def create_project(project: ProjectCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project_service = ProjectService(db)
    db_project = project_service.create_project(project, current_user)
    return db_project

@router.get("/projects", response_model=Page[ProjectOutput],
            dependencies=[Depends(role_required([UserRole.EMPLOYEE, UserRole.EMPLOYER]))])
def get_projects(db: Session = Depends(get_db), current_user: User = Depends(get_current_user),
               page:int | None = 1, size:int |None = 10):
    param = Params(page=page, size=size)
    project_service = ProjectService(db)
    return project_service.get_user_projects(current_user, param)

@router.post("/projects/users/{project_id}", dependencies=[Depends(role_required([UserRole.EMPLOYER]))])
def assign_employees_to_project(db: Session = Depends(get_db), current_user: User = Depends(get_current_user),
             employees: ProjectEmployeeCreate = None,
             project_id: int = Path()):
    project_service = ProjectService(db)
    db_project = project_service.assign_employees(project_id, employees, current_user)
    return db_project

@router.get("/projects/users/{project_id}", response_model=List[ProjectEmployeeOutput],
            dependencies=[Depends(role_required([UserRole.EMPLOYER]))])
def get_employees_in_project(db: Session = Depends(get_db), project_id: int = Path(),
                             current_user: User = Depends(get_current_user)):
    project_service = ProjectService(db)
    return project_service.get_assigned_projects(project_id)

@router.post("/projects/update_status", dependencies=[Depends(role_required([UserRole.EMPLOYER]))])
def assign_employees_to_project(db: Session = Depends(get_db), current_user: User = Depends(get_current_user),
             update_request: ProjectUpdateRequest = None):
    project_service = ProjectService(db)
    db_project = project_service.update_status(update_request, current_user)
    return db_project