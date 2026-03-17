from __future__ import annotations

from typing import Any, Literal, Optional

from pydantic import BaseModel, Field


class UploadResponse(BaseModel):
    datasetId: str
    rowsProcessed: int
    status: str


class AnalyzeRequest(BaseModel):
    datasetId: str


class KPIModel(BaseModel):
    total_revenue: float
    total_net_revenue: float
    total_impressions: int
    total_data_providers: int
    total_segments: int
    avg_cpm: float


class ChartModel(BaseModel):
    id: str
    title: str
    type: Literal["bar", "pie", "line", "scatter"]
    x_axis: Optional[str] = None
    y_axis: Optional[str] = None
    data: list[dict[str, Any]]


class SummaryModel(BaseModel):
    kpis: KPIModel
    charts: list[ChartModel]


class InsightModel(BaseModel):
    id: str
    type: str
    title: str
    description: str
    confidence: float
    supporting_data: dict[str, Any] | None = None
    recommendation: str | None = None


class ScenarioImpactModel(BaseModel):
    estimated_revenue_increase: float | None = None
    estimated_net_revenue_increase: float | None = None
    estimated_cost_savings: float | None = None
    confidence: float | None = None
    estimated_revenue: float | None = None
    net_revenue: float | None = None


class ScenarioModel(BaseModel):
    scenario_id: str
    title: str
    assumption: str
    impact: ScenarioImpactModel
    affected_entities: dict[str, Any] | None = None


class AnalyzeResponse(BaseModel):
    summary: SummaryModel
    insights: list[InsightModel] = Field(default_factory=list)
    anomalies: list[dict[str, Any]] = Field(default_factory=list)
    root_cause_analysis: list[dict[str, Any]] = Field(default_factory=list)
    scenarios: list[ScenarioModel] = Field(default_factory=list)
