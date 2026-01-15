"""Run to create tables from SQLAlchemy models via Base.metadata.create_all().
Usage:
    myenv\Scripts\python.exe scripts\create_tables.py
"""

if __name__ == "__main__":
    # Importing app.db.database triggers Base.metadata.create_all(bind=engine)
    import app.db.database as _db
    print("Base.metadata.create_all executed (if no errors, tables were created).")
