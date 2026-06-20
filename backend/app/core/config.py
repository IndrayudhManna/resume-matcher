from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    REDIS_URL: str
    OPENAI_API_KEY: str
    ADZUNA_APP_ID: str = ""
    ADZUNA_APP_KEY: str = ""
    SECRET_KEY: str
    OLLAMA_MODEL: str = "llama3.1"

    class Config:
        env_file = ".env"

settings = Settings()