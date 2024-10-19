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
    description: Optional[str]
    project_id: int

class CheckOutRequest(BaseModel):
    id: Optional[int]
    out_time: datetime
    description: Optional[str]
    project_id: Optional[int]

class CheckInOutGetRequest(BaseModel):
    id: Optional[int]
    in_time: Optional[datetime]
    out_time: Optional[datetime]
    description: Optional[str]
    user_id: Optional[int]
    project_id: Optional[int]
