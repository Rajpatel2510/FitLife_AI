import os
import sys
from dotenv import load_dotenv
load_dotenv()

from app.db.database import sessionLocal
from app.models.user_model import User
from app.authentication.auth import hash_password

EMAIL = sys.argv[1] if len(sys.argv) > 1 else "xyz1@gmail.com"
NEW_PASSWORD = sys.argv[2] if len(sys.argv) > 2 else "xyz1@pass"

print(f"Using DATABASE_URL={os.getenv('DATABASE_URL')}")

db = sessionLocal()
try:
    user = db.query(User).filter(User.email == EMAIL.lower().strip()).first()
    if not user:
        print(f"User not found for email: {EMAIL}")
    else:
        user.password_hash = hash_password(NEW_PASSWORD)
        db.add(user)
        db.commit()
        print(f"Password for {EMAIL} updated successfully.")
finally:
    db.close()
