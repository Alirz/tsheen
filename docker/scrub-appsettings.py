"""Remove connection strings and passphrases from published JSON config."""
import json
import sys
from pathlib import Path


def scrub(path: Path) -> None:
    text = path.read_text(encoding="utf-8-sig")
    if not text.strip():
        path.unlink()
        return
    try:
        data = json.loads(text)
    except json.JSONDecodeError:
        raise SystemExit(f"invalid json: {path}") from None
    if not isinstance(data, dict):
        return
    data.pop("ConnectionStrings", None)
    data.pop("StringEncryption", None)
    auth = data.get("AuthServer")
    if isinstance(auth, dict):
        auth.pop("CertificatePassPhrase", None)
    path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")


root = Path(sys.argv[1])
for path in root.rglob("appsettings*.json"):
    scrub(path)
