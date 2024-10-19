from datetime import datetime
import re

from sqlalchemy.orm import Session
from sqlalchemy import select, desc
from app.db.models import User, Project, ProjectStatus, UserProject, CheckInOut, CheckInOutStatus
from app.schemas.project import ProjectCreate, ProjectEmployeeCreate
from fastapi import HTTPException
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate

def create_checkin(db , user, checkin_request):
    user_input = checkin_request.dict()
    user_input['user_id'] = user.id
    user_input['status'] = CheckInOutStatus.CHECKIN
    db_checkinout = CheckInOut(**user_input)
    db.add(db_checkinout)
    db.commit()
    db.refresh(db_checkinout)
    return db_checkinout

def get_current_checkin(db, user):
    checkinout = db.query(CheckInOut).filter(CheckInOut.user_id == user.id).order_by(desc(CheckInOut.id)).first()
    if checkinout is not None:
        if checkinout.status == CheckInOutStatus.CHECKIN:
            return checkinout

def create_checkout(db , user, checkout_request):
    current_chekinout = get_current_checkin(db, user)
    if current_chekinout is not CheckInOut:
        raise HTTPException(status_code=404, detail="No checkin found!")
    current_chekinout.out_time = checkout_request.out_time
    current_chekinout.description = checkout_request.description
    current_chekinout.status = CheckInOutStatus.CHECKOUT
    db.commit()
    db.refresh(current_chekinout)
    return current_chekinout

def get_checkinout(db: Session, current_user, params, filters):
    print(filters)
    checkinouts = select(CheckInOut).filter(CheckInOut.user_id == current_user.id)
    if "project_id" in filters:
        checkinouts.filter(CheckInOut.project_id == filters['project_id'])
    if "user_id" in filters:
        checkinouts.filter(CheckInOut.user_id == filters['user_id'])

    return paginate(db, checkinouts, params)
