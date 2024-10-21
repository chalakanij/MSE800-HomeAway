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
        orm_mode = True


class ProjectOutput(Project):
    class Config:
        from_attribute = True


class ProjectEmployeeCreate(BaseModel):
    employee_id: List[int]

    class Config:
        orm_mode = True


class ProjectEmployeeOutput(ProjectEmployeeCreate):
    project_id: int

    class Config:
        from_attribute = True


class ProjectUpdateRequest(BaseModel):
    project_id: int
    status: ProjectStatus


class ProjectStatusCount(BaseModel):
    status: str
    count: int