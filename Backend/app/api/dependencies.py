from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from sqlalchemy.exc import SQLAlchemyError, OperationalError
from app.db import SessionLocal
from typing import List
from app.db.models import User as UserModel
from fastapi.security import OAuth2PasswordBearer
from app.auth.jwt import create_access_token, verify_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    except OperationalError as e:
        # Catch database connection error (for MySQL, this may happen if the server is unreachable)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Could not connect to the database. Please try again later.",
        )
    except SQLAlchemyError as e:
        # General SQLAlchemy exception
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="A database error occurred. Please try again later.",
        )
    finally:
        db.close()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    token_data = verify_token(token, credentials_exception)
    user = db.query(UserModel).filter(UserModel.email == token_data.email).first()
    if user is None:
        raise credentials_exception
    return user


def role_required(required_roles: List[str]):
    def role_checker(user: dict = Depends(get_current_user)):
        if user.role not in required_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have access to this resource"
            )
        return user
    return role_checker