from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker,declarative_base
from dotenv import load_dotenv
import os

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
Base = declarative_base()

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL not set")

engine = create_engine(DATABASE_URL)
sessionLocal = sessionmaker(autoflush=False,autocommit=False,bind=engine)

# Base.metadata.create_all(bind=engine)

def get_db():
    db = sessionLocal()
    try: 
        yield db
    finally:
        db.close()