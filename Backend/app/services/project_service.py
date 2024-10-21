from datetime import datetime
import re

from sqlalchemy.orm import Session
from sqlalchemy import select
from app.db.models import User, Project, ProjectStatus, UserProject
from app.schemas.project import ProjectCreate, ProjectEmployeeCreate
from fastapi import HTTPException
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate


class ProjectService:
    def __init__(self, db:Session):
        self.db = db

    def create_project(self, project: ProjectCreate, current_user: User):
        user_input = project.dict()
        user_input['user_id'] = current_user.id
        db_project = Project(**user_input)
        self.db.add(db_project)
        self.db.commit()
        self.db.refresh(db_project)
        return db_project

    def get_employer_projects(self, current_user, params):
        project_data = select(Project).filter(Project.user_id == current_user.id)
        return paginate(self.db, project_data, params)


    def assign_employees(self, project_id, project_employee: ProjectEmployeeCreate, current_user: User):
        #user_input = project_employee.dict()
        for empolyee in project_employee.employee_id:
            db_project_employee = UserProject(employee_id=empolyee, project_id = project_id)
            self.db.add(db_project_employee)
            self.db.commit()
        return self.get_assigned_projects(project_id, current_user)

    def get_assigned_projects(self, project_id, current_user):
        users_data = (select(UserProject).join(Project)
                      .filter(UserProject.project_id == project_id)
                      .filter(Project.user_id == current_user.id))
        return self.db.query(users_data).all()

    def update_status(self, update_request, user):
        project = self.db.query(Project).filter(Project.id == update_request.project_id).first()
        project.status = update_request.status
        self.db.commit()
        self.db.refresh(project)
        return project