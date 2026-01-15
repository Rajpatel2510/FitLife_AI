import os
import sys
from dotenv import load_dotenv
load_dotenv()

from app.db.database import sessionLocal
from app.models.user_model import User
from app.authentication.auth import verify_password
from app.authentication.auth import hash_password

TEST_EMAIL = sys.argv[1] if len(sys.argv) > 1 else "xyz1@gmail.com"
TEST_PASSWORD = sys.argv[2] if len(sys.argv) > 2 else "xyz1@pass"

print(f"Using DATABASE_URL={os.getenv('DATABASE_URL')}")

db = sessionLocal()
try:
    user = db.query(User).filter(User.email == TEST_EMAIL.lower().strip()).first()
    if not user:
        print(f"User not found for email: {TEST_EMAIL}")
    else:
        print(f"Found user id={user.id} email={user.email} password_hash={user.password_hash}")
        print(f"stored hash repr: {repr(user.password_hash)} length={len(user.password_hash) if user.password_hash else 0}")
        ok = verify_password(TEST_PASSWORD, user.password_hash)
        print(f"verify_password returned: {ok}")
        new_hash = hash_password(TEST_PASSWORD)
        print(f"new hash for given password: {new_hash} length={len(new_hash)}")
        test_ok = verify_password(TEST_PASSWORD, new_hash)
        print(f"verify against freshly generated hash returned: {test_ok}")
finally:
    db.close()
