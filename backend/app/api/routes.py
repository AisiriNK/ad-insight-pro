from __future__ import annotations

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.agents.agent_service import call_agent
from app.config.settings import settings
from app.models.schemas import AnalyzeRequest, AnalyzeResponse, UploadResponse
from app.services.analytics_service import process_csv
from app.services.feature_store import (
    get_cached_analysis,
    get_dataset_file,
    register_dataset,
    set_cached_analysis,
    insert_dataframe,
)
from app.services.response_service import (
    aggregate_response,
    build_agent_payload,
    build_summary,
)
from app.services.storage_service import save_upload
from app.utils.errors import AgentError, ValidationError
from app.utils.validators import validate_schema
import pandas as pd

router = APIRouter(prefix=settings.api_prefix)


@router.post("/upload-csv", response_model=UploadResponse)
async def upload_csv(file: UploadFile = File(...)) -> UploadResponse:
    if not file.filename:
        raise HTTPException(status_code=400, detail="Missing filename")

    dataset_id, path = save_upload(file.file, file.filename)

    try:
        df_head = pd.read_csv(path, nrows=5)
        validate_schema(df_head)
        rows_processed = sum(1 for _ in open(path, "rb")) - 1
    except ValidationError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    register_dataset(dataset_id, path, max(rows_processed, 0))

    return UploadResponse(
        datasetId=dataset_id,
        rowsProcessed=max(rows_processed, 0),
        status="uploaded",
    )


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(request: AnalyzeRequest) -> AnalyzeResponse:
    cached = get_cached_analysis(request.datasetId)
    if cached:
        return AnalyzeResponse(**cached)

    file_path = get_dataset_file(request.datasetId)
    if not file_path:
        raise HTTPException(status_code=404, detail="Dataset not found")

    try:
        analytics = process_csv(file_path, request.datasetId)

        insert_dataframe("provider_metrics", analytics.provider_metrics)
        insert_dataframe("segment_metrics", analytics.segment_metrics)
        insert_dataframe("platform_metrics", analytics.platform_metrics)
        insert_dataframe("vertical_metrics", analytics.vertical_metrics)
        insert_dataframe("advertiser_metrics", analytics.advertiser_metrics)
        insert_dataframe("imbalance_metrics", analytics.imbalance_metrics)
        insert_dataframe("reporting_metrics", analytics.reporting_metrics)

        summary = build_summary(request.datasetId)
        payload = build_agent_payload(request.datasetId)

        insight_response = None
        anomaly_response = None
        rca_response = None
        simulation_response = None

        try:
            if settings.insight_agent_url:
                insight_response = call_agent(settings.insight_agent_url, payload)
            if settings.anomaly_agent_url:
                anomaly_response = call_agent(settings.anomaly_agent_url, payload)
            if settings.rca_agent_url:
                rca_response = call_agent(settings.rca_agent_url, payload)
            if settings.simulation_agent_url:
                simulation_response = call_agent(
                    settings.simulation_agent_url, payload
                )
        except AgentError:
            pass

        response = aggregate_response(
            summary,
            insight_response,
            anomaly_response,
            rca_response,
            simulation_response,
        )

        set_cached_analysis(request.datasetId, response)
        return AnalyzeResponse(**response)
    except ValidationError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.get("/dashboard/{dataset_id}", response_model=AnalyzeResponse)
async def dashboard(dataset_id: str) -> AnalyzeResponse:
    cached = get_cached_analysis(dataset_id)
    if not cached:
        raise HTTPException(status_code=404, detail="No cached analysis found")
    return AnalyzeResponse(**cached)
