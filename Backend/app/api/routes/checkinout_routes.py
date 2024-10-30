from fastapi import APIRouter, Depends, HTTPException, status, Path
from fastapi_pagination import Params
from sqlalchemy.orm import Session
from app.services.checkinout_service import CheckInOutService
from app.schemas.user import User
from app.schemas.checkinout import CheckInRequest, CheckInOut, CheckinUpdateRequest, CheckInOutGetRequest
from fastapi import Depends
from fastapi_pagination import Page
from app.api.dependencies import get_db
from app.api.dependencies import get_current_user
from typing import Optional
from app.db.models import UserRole
from app.api.dependencies import role_required

router = APIRouter()

@router.get("/checkin_status", response_model=Optional[CheckInOut],
            dependencies=[Depends(role_required([UserRole.EMPLOYER, UserRole.EMPLOYEE]))],
            description="Require: EMPLOYEE | EMPLOYER, To check current checkin status")
async def check_current_checkin_status(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ch_service = CheckInOutService(db)
    return ch_service.get_current_checkin(current_user)

@router.post("/checkin", response_model=CheckInOut, dependencies=[Depends(role_required([UserRole.EMPLOYER, UserRole.EMPLOYEE]))],
             description="EMPLOYEE | EMPLOYER, perform checkin, out_time is optional to checkout")
async def create_checkin_record(checkin: CheckInRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ch_service = CheckInOutService(db)
    return ch_service.create_checkin(current_user, checkin)

@router.get("/checkinout", response_model=Page[CheckInOut], dependencies=[Depends(role_required([UserRole.EMPLOYEE, UserRole.EMPLOYER]))],
            description="EMPLOYEE| EMPLOYER, Read checkinout records, if EMPLOYEE only their records, if EMPLOYER, all employees under their account")
async def get_checkinout_records( db: Session = Depends(get_db), current_user: User = Depends(get_current_user),
               page:int | None = 1, size:int |None = 10, user_id:int = None, project_id:int = None):
    param = Params(page=page, size=size)
    ch_service = CheckInOutService(db)
    return ch_service.get_checkinout(current_user, param, user_id, project_id)

@router.put("/checkinout", response_model=Optional[CheckInOut], dependencies=[Depends(role_required([UserRole.EMPLOYER, UserRole.EMPLOYEE]))],
            description="EMPLOYEE | EMPLOYER, Update checkinout record")
async def update_checkinout_record(checkin_update: CheckinUpdateRequest, db: Session = Depends(get_db),
                           current_user: User = Depends(get_current_user)):
    ch_service = CheckInOutService(db)
    return ch_service.update_checkin(current_user, checkin_update)

