from pydantic import BaseModel, EmailStr
from typing import List
from enum import Enum
from app.db.models import ProjectStatus


class ProjectCreate(BaseModel):
    title: str
    description: str
    work_hours: int


class Project(BaseModel):
    id: int
    user_id: int
    title: str
    description: str
    work_hours: int
    status: str

    class Config:
        from_attributes = True


class ProjectOutput(Project):
    class Config:
        from_attribute = True


class ProjectEmployeeCreate(BaseModel):
    employee_id: List[int]

    class Config:
        from_attributes = True


class ProjectEmployeeOutput(BaseModel):
    employee_id: int
    project_id: int

    class Config:
        from_attributes = True


class ProjectUpdateRequest(BaseModel):
    project_id: int
    status: ProjectStatus


class ProjectStatusCount(BaseModel):
    status: str
    count: int