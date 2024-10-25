from datetime import datetime
import re

from sqlalchemy.orm import Session
from sqlalchemy import select
from app.db.models import User, Project, ProjectStatus, UserProject, UserRole
from app.schemas.project import ProjectCreate, ProjectEmployeeCreate, ProjectEmployeeOutput
from fastapi import HTTPException
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate
from typing import List

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

        # assign project to owner by default
        temp_employee = ProjectEmployeeCreate(employee_id=[current_user.id])
        self.assign_employees(db_project.id, temp_employee, current_user)
        return db_project

    def get_user_projects(self, user, param):
        if user.role == UserRole.EMPLOYER:
            project_data = select(Project).filter(Project.user_id == user.id)
        elif user.role == UserRole.EMPLOYEE:
            project_data = select(Project).join(UserProject).filter(UserProject.employee_id == user.id)
        return paginate(self.db, project_data, param)


    def assign_employees(self, project_id, project_employee: ProjectEmployeeCreate, current_user: User):
        assigned_users = self.get_assigned_projects(project_id)
        assigned_employee_ids = {user.employee_id for user in assigned_users}

        for employee_id in project_employee.employee_id:
            if employee_id not in assigned_employee_ids:
                db_project_employee = UserProject(employee_id=employee_id, project_id = project_id)
                self.db.add(db_project_employee)
                self.db.commit()
        return self.get_assigned_projects(project_id)

    def get_assigned_projects(self, project_id: int) -> List[ProjectEmployeeOutput]:
        users_data = (
            select(UserProject)
            .join(Project, UserProject.project_id == Project.id)
            .filter(UserProject.project_id == project_id)
        )

        result = self.db.execute(users_data).scalars().all()
        return [ProjectEmployeeOutput.from_orm(user_project) for user_project in result]


    def update_status(self, update_request, user):
        project = self.db.query(Project).filter(Project.id == update_request.project_id).first()
        project.status = update_request.status
        self.db.commit()
        self.db.refresh(project)
        return project

