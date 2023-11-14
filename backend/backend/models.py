from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker

Base = declarative_base()

# TODO: define your SQLAlchemy models here


def init_db(uri):
    engine = create_engine(uri)
    db_session = scoped_session(
        sessionmaker(autocommit=False, autoflush=False, bind=engine),
    )
    Base.query = db_session.query_property()
    Base.metadata.create_all(bind=engine)
    return db_session
