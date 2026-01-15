from datetime import timedelta


# SECRET_KEY = "KSdeegthdivduqwomvDrdvnwoRedhucaslloiwsurcwDFFAQWCewnkwwr"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

ACCESS_TOKEN_EXPIRE_DELTA = timedelta(
    minutes=ACCESS_TOKEN_EXPIRE_MINUTES
)
