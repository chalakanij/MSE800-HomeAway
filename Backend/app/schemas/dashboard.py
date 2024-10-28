from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

from app.schemas.project import ProjectStatusCount

class EmployeeDashboard(BaseModel):
    projects: Optional[List[ProjectStatusCount]]
    last_checkin: Optional[datetime] = None
    last_checkout: Optional[datetime] = None

class ProjectHours(BaseModel):
    project_id: int
    project_title: str
    project_status: str
    work_hours:int
    calculated:Optional[int]=0

class EmployerDashboard(BaseModel):
    projects: Optional[List[ProjectStatusCount]]
    employees: Optional[List[ProjectStatusCount]] = None
    project_hours: Optional[ProjectHours] = None

class AdminDashboard(BaseModel):
    employees: Optional[List[ProjectStatusCount]]
    employers: Optional[List[ProjectStatusCount]]
    projects: Optional[List[ProjectStatusCount]]