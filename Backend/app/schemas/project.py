from pydantic import BaseModel, EmailStr

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
    employee_id: int

    class Config:
        orm_mode = True

class ProjectEmployeeOutput(ProjectEmployeeCreate):
    project_id : int
    class Config:
        from_attribute = True
