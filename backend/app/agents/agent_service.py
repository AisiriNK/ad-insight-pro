from __future__ import annotations

from typing import Any

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from app.config.settings import settings
from app.utils.errors import AgentError
from app.utils.logger import get_logger

logger = get_logger(__name__)


def _get_headers() -> dict[str, str]:
    if not settings.agent_api_token:
        raise AgentError("AGENT_API_TOKEN is not set")
    return {"Authorization": f"Bearer {settings.agent_api_token}"}


@retry(
    stop=stop_after_attempt(settings.agent_retry_attempts),
    wait=wait_exponential(multiplier=1, min=1, max=10),
    reraise=True,
)
def call_agent(api_url: str, payload: dict[str, Any]) -> dict[str, Any]:
    if not api_url:
        raise AgentError("Agent URL is not configured")

    headers = _get_headers()
    try:
        with httpx.Client(timeout=settings.agent_timeout_seconds) as client:
            response = client.post(api_url, json=payload, headers=headers)
            response.raise_for_status()
            return response.json()
    except httpx.HTTPError as exc:
        logger.error("Agent call failed: %s", exc)
        raise AgentError(str(exc)) from exc
