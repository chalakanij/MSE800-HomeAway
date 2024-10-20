from datetime import datetime
import re

from sqlalchemy.orm import Session
from sqlalchemy import select
from app.db.models import User, Project, ProjectStatus, UserProject
from app.schemas.project import ProjectCreate, ProjectEmployeeCreate
from fastapi import HTTPException
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate


def create_project(db: Session, project: ProjectCreate, current_user: User):
    user_input = project.dict()
    user_input['user_id'] = current_user.id
    db_project = Project(**user_input)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

def get_employer_projects(db: Session, current_user, params):
    project_data = select(Project).filter(Project.user_id == current_user.id)
    return paginate(db, project_data, params)


def assign_employees(db: Session, project_id, project_employee: ProjectEmployeeCreate, current_user: User):
    user_input = project_employee.dict()
    user_input['project_id'] = project_id
    db_project_employee = UserProject(**user_input)
    db.add(db_project_employee)
    db.commit()
    db.refresh(db_project_employee)
    return db_project_employee

def get_assigned_projects(db: Session, project_id, current_user, params):
    users_data = (select(UserProject).join(Project)
                  .filter(UserProject.project_id == project_id)
                  .filter(Project.user_id == current_user.id))
    return paginate(db, users_data, params)