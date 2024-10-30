from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.utils.hashing import hash_password
from .models import Base, UserRole, User
from app.config import DATABASE_URL

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)

    # Open a session
    db = SessionLocal()
    try:
        # Check if admin user already exists
        admin_user = db.query(User).filter(User.role == UserRole.ADMIN).first()
        if not admin_user:
            # If no admin exists, create one
            hashed_password = hash_password("admin")
            admin_user = User(
                email="admin@admin.com",
                title="Mr.",
                first_name="Admin",
                last_name="User",
                phone_number="0724282292",
                role=UserRole.ADMIN,
                hashed_password=hashed_password
            )
            db.add(admin_user)
            db.commit()
            print("Admin user created.")
    except Exception as e:
        print("Error creating admin user:", e)
    finally:
        db.close()