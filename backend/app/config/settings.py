from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "AdAnalytics AI Backend"
    api_prefix: str = "/api"
    data_dir: str = "./data"
    duckdb_path: str = "./data/analytics.duckdb"

    agent_api_token: str | None = None
    insight_agent_url: str | None = None
    anomaly_agent_url: str | None = None
    rca_agent_url: str | None = None
    simulation_agent_url: str | None = None

    agent_timeout_seconds: int = 30
    agent_retry_attempts: int = 3


settings = Settings()
