import os
from pathlib import Path
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseModel):
    PROJECT_NAME: str = "OmniCare CDS"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Storage & SQLite
    DATA_DIR: Path = BASE_DIR / "data"
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR / 'data' / 'omnicare.db'}")
    
    # AWS Communication Developer Services (CDS) Config
    AWS_REGION: str = os.getenv("AWS_REGION", "us-east-1")
    AWS_CDS_MODE: str = os.getenv("AWS_CDS_MODE", "HYBRID_SIMULATION")  # LIVE or HYBRID_SIMULATION
    
    # AWS End User Messaging (EUM) SMS & RCS
    AWS_EUM_ORIGINATION_NUMBER: str = os.getenv("AWS_EUM_ORIGINATION_NUMBER", "+18005550199")
    AWS_EUM_RCS_AGENT_ID: str = os.getenv("AWS_EUM_RCS_AGENT_ID", "omnicare-clinical-rcs-agent")
    AWS_EUM_RCS_BRAND_NAME: str = "OmniCare Health Network"
    
    # AWS End User Messaging Social (WhatsApp - Meta Sponsored)
    AWS_EUM_WHATSAPP_PHONE_ID: str = os.getenv("AWS_EUM_WHATSAPP_PHONE_ID", "waba-phone-1098234")
    AWS_EUM_WHATSAPP_WABA_ID: str = os.getenv("AWS_EUM_WHATSAPP_WABA_ID", "waba-acct-558291")
    
    # Amazon SES
    AWS_SES_SENDER_EMAIL: str = os.getenv("AWS_SES_SENDER_EMAIL", "clinical-care@omnicare.health")
    
    # Amazon Bedrock AgentCore
    BEDROCK_MODEL_ID: str = os.getenv("BEDROCK_MODEL_ID", "anthropic.claude-3-5-sonnet-20241022-v2:0")
    AGENTCORE_REGION: str = os.getenv("AGENTCORE_REGION", "us-east-1")
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ]

settings = Settings()
settings.DATA_DIR.mkdir(parents=True, exist_ok=True)
