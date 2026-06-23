from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings
import re

# Convert to asyncpg format
DATABASE_URL = settings.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")

# Strip all sslmode parameters from URL regardless of format
DATABASE_URL = re.sub(r'[?&]sslmode=[^&]*', '', DATABASE_URL)

engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    connect_args={"ssl": True}
)

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session