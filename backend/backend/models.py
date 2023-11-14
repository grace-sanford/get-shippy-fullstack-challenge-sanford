from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

Base = declarative_base()

# TODO: define your SQLAlchemy models here
class Report(Base):
    __tablename__ = "reports" 
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime)

    def __repr__(self) -> str:
        return f"Report(id={self.id!r})"


def init_db(uri):
    engine = create_engine(uri)
    db_session = scoped_session(
        sessionmaker(autocommit=False, autoflush=False, bind=engine),
    )
    Base.query = db_session.query_property()
    Base.metadata.create_all(bind=engine)
    return db_session
