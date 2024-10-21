from datetime import datetime
import re

from sqlalchemy.orm import Session
from sqlalchemy import select, desc
from app.db.models import User, Project, ProjectStatus, UserProject, CheckInOut, CheckInOutStatus
from app.schemas.checkinout import CheckinUpdateRequest
from fastapi import HTTPException
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate
from starlette.status import HTTP_404_NOT_FOUND


class CheckInOutService:
    def __init__(self, db: Session):
        self.db = db

    def create_checkin(self , user, checkin_request):
        user_input = checkin_request.dict()
        user_input['user_id'] = user.id
        user_input['status'] = CheckInOutStatus.CHECKIN
        db_checkinout = CheckInOut(**user_input)
        self.db.add(db_checkinout)
        self.db.commit()
        self.db.refresh(db_checkinout)
        return db_checkinout

    def get_current_checkin(self, user):
        checkinout = self.db.query(CheckInOut).filter(CheckInOut.user_id == user.id).order_by(desc(CheckInOut.id)).first()
        if checkinout is not None:
            if checkinout.status == CheckInOutStatus.CHECKIN:
                return checkinout

    def create_checkout(self , user, checkout_request):
        current_chekinout = self.get_current_checkin(user)
        if current_chekinout is None:
            raise HTTPException(status_code=404, detail="No checkin found!")
        current_chekinout.out_time = checkout_request.out_time
        current_chekinout.description = checkout_request.description
        current_chekinout.status = CheckInOutStatus.CHECKOUT
        self.db.commit()
        self.db.refresh(current_chekinout)
        return current_chekinout

    def get_checkinout(self, current_user, params, filters):
        checkinouts = select(CheckInOut).filter(CheckInOut.user_id == current_user.id)
        if filters.project_id is not None:
            checkinouts = checkinouts.filter(CheckInOut.project_id == filters.project_id)
        if filters.user_id is not None:
            checkinouts = checkinouts.filter(CheckInOut.user_id == filters.user_id)
        return paginate(self.db, checkinouts, params)

    def update_checkin(self, user, checkin_request: CheckinUpdateRequest):
        checkin = self.db.query(CheckInOut).filter(CheckInOut.id == checkin_request.id).first()
        if checkin is not None:
            if checkin_request.in_time is not None:
                checkin.in_time = checkin_request.in_time
            if checkin_request.out_time is not None:
                checkin.out_time = checkin_request.out_time
            if checkin_request.description is not None:
                checkin.description = checkin_request.description
            if checkin_request.project_id is not None:
                checkin.project_id = checkin_request.project_id
            self.db.commit()
            self.db.refresh(checkin)
            return checkin
        else:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="No chckin record found!")

    # calculate working hours based on criteria
    def calculate_hours(self, employee_id:int| None=None, project_id: int| None=None,
                        from_date:datetime | None=None, to_date:datetime | None=None):
        query = select(CheckInOut)
        if employee_id is not None:
            query = query.filter(CheckInOut.user_id == employee_id)
        if project_id is not None:
            query = query.filter(CheckInOut.project_id == project_id)
        if from_date is not None:
            query = query.filter(CheckInOut.in_time >= from_date)
        if to_date is not None:
            query = query.filter(CheckInOut.out_time <= to_date)
        result = self.db.execute(query).scalars().all()
        total_seconds = 0
        for row in result:
            if row.out_time is not None:
                time_difference = row.out_time - row.in_time
                total_seconds += time_difference.total_seconds()
        return total_seconds/60/60