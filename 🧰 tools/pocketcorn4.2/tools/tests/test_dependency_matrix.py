from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))

from tools.deploy.generate_dependency_matrix import main as generate_matrix


def test_dependency_matrix(tmp_path: Path) -> None:
    target = tmp_path / "dependency_matrix.json"
    original_output = Path("reports/dependency_matrix.json")
    backup = None
    if original_output.exists():
        backup = original_output.read_text(encoding="utf-8")
    try:
        generate_matrix()
        assert original_output.exists()
        data = json.loads(original_output.read_text(encoding="utf-8"))
        assert "runtime" in data and "dev" in data
    finally:
        if backup is not None:
            original_output.write_text(backup, encoding="utf-8")
