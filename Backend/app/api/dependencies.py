from fastapi import Depends, HTTPException, status
from sqlalchemy.exc import SQLAlchemyError, OperationalError
from app.db import SessionLocal

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
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="A database error occurred. Please try again later.",
        )
    finally:
        db.close()
