import pytest

from app.agents.agent_service import call_agent
from app.utils.errors import AgentError


def test_call_agent_requires_url():
    with pytest.raises(AgentError):
        call_agent("", {})
