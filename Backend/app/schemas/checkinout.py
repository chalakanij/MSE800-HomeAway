from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class CheckInOut(BaseModel):
    id: int
    user_id: int
    status: int
    in_time: datetime
    out_time: Optional[datetime]
    description: Optional[str]
    project_id: int

class CheckInRequest(BaseModel):
    in_time: datetime
    out_time: Optional[datetime] = None
    description: Optional[str] = None
    project_id: int

class CheckInOutGetRequest(BaseModel):
    id: Optional[int] = None
    in_time: Optional[datetime] = None
    out_time: Optional[datetime] = None
    description: Optional[str] = None
    user_id: Optional[int] = None
    project_id: Optional[int] = None

class CheckinUpdateRequest(BaseModel):
    id: int
    in_time: Optional[datetime]
    out_time: Optional[datetime]
    description: Optional[str]
    project_id: Optional[int]