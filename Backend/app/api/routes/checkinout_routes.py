from fastapi import APIRouter, Depends, HTTPException, status, Path
from fastapi_pagination import Params
from sqlalchemy.orm import Session
#from app.services.checkinout_service import get_current_checkin, get_checkinout, create_checkin, create_checkout
from app.services.checkinout_service import CheckInOutService
from app.schemas.user import User
from app.schemas.project import Project, ProjectCreate, ProjectOutput, ProjectEmployeeCreate, ProjectEmployeeOutput
from app.schemas.checkinout import CheckInRequest, CheckInOut, CheckOutRequest, CheckinUpdateRequest, CheckInOutGetRequest
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from fastapi_pagination import Page
from app.api.dependencies import get_db
from app.api.routes.user_routes import get_current_user
from typing import Optional


router = APIRouter()

@router.get("/checkin_status", response_model=Optional[CheckInOut])
def check_current_checkin_status(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ch_service = CheckInOutService(db)
    return ch_service.get_current_checkin(current_user)

@router.post("/checkin", response_model=CheckInOut)
def create_checkin_record(checkin: CheckInRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ch_service = CheckInOutService(db)
    return ch_service.create_checkin(current_user, checkin)

@router.post("/checkout", response_model=CheckInOut)
def create_checkout_record(checkout: CheckOutRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ch_service = CheckInOutService(db)
    return ch_service.create_checkout(current_user, checkout)

@router.get("/checkinout", response_model=Page[CheckInOut])
def get_checkinout_records( filters: CheckInOutGetRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user),
               page:int | None = 1, size:int |None = 10):
    param = Params(page=page, size=size)
    ch_service = CheckInOutService(db)
    return ch_service.get_checkinout(current_user, param, filters)

@router.put("/checkinout", response_model=Optional[CheckInOut])
def update_checkinout_record(checkin_update: CheckinUpdateRequest, db: Session = Depends(get_db),
                           current_user: User = Depends(get_current_user)):
    ch_service = CheckInOutService(db)
    return ch_service.update_checkin(current_user, checkin_update)

