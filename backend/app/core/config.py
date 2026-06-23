from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    REDIS_URL: str
    OPENAI_API_KEY: str = "not_used"
    ADZUNA_APP_ID: str = ""
    ADZUNA_APP_KEY: str = ""
    SECRET_KEY: str
    OLLAMA_MODEL: str = "llama3.1"
    GROQ_API_KEY: str = ""
    USE_GROQ: bool = True

    class Config:
        env_file = ".env"

settings = Settings()