from __future__ import annotations

import os
import uuid
from pathlib import Path
from typing import IO

from app.config.settings import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)


def ensure_data_dir() -> Path:
    data_dir = Path(settings.data_dir)
    data_dir.mkdir(parents=True, exist_ok=True)
    return data_dir


def generate_dataset_id() -> str:
    return f"dataset_{uuid.uuid4().hex[:12]}"


def save_upload(file_obj: IO[bytes], filename: str) -> tuple[str, str]:
    data_dir = ensure_data_dir()
    dataset_id = generate_dataset_id()
    safe_name = filename.replace("/", "_")
    path = data_dir / f"{dataset_id}_{safe_name}"

    with open(path, "wb") as f:
        while True:
            chunk = file_obj.read(1024 * 1024)
            if not chunk:
                break
            f.write(chunk)

    logger.info("Saved upload %s", path)
    return dataset_id, str(path)


def file_exists(path: str) -> bool:
    return os.path.exists(path)
