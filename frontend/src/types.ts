export interface Patient {
  id: string
  first_name: string
  last_name: string
  condition: string
  discharge_date: string
  risk_level: string
  phone_number: string
  email: string
  preferred_channel: string
  current_medications: Array<{ name: string; dosage: string; rx_number: string }>
  allergies: string[]
  assigned_physician: string
}

export interface SessionData {
  id: string
  patient: {
    id: string
    name: string
    condition: string
    discharge_date: string
    risk_level: string
    phone: string
    email: string
    assigned_physician: string
    medications: Array<{ name: string; dosage: string; rx_number: string }>
  }
  active_channel: string
  stage: string
  triage_score: number
  triage_summary: string
  uploaded_image_url: string | null
  image_analysis_summary: any | null
  selected_pharmacy_id: string | null
  selected_pickup_slot: string | null
  prescription_token: string | null
  context_graph: any
  updated_at: string
}

export interface MessageItem {
  id: string
  channel: string // SMS, RCS, WHATSAPP, SES_EMAIL
  direction: string // INBOUND, OUTBOUND
  message_type: string
  content: string
  payload: any
  delivery_status: string
  aws_message_id?: string
  created_at: string
}

export interface AgentTraceItem {
  id: string
  agent_name: string
  state_node: string
  thought: string
  tool_name: string | null
  tool_input: any
  tool_output: any
  channel_handover: string | null
  latency_ms: number
  timestamp: string
}

export interface PharmacyItem {
  id: string
  name: string
  chain: string
  address: string
  distance_miles: number
  phone: string
  hours: string
  stock_status: string
  has_drive_thru: boolean
}

export interface TelemetryData {
  status: string
  total_messages_exchanged: number
  channel_distribution: Record<string, number>
  mean_latencies_ms: Record<string, number>
  delivery_rates: Record<string, string>
  omnichannel_conversion_rate: string
  financial_impact: {
    traditional_call_center_cost: string
    aws_cds_orchestration_cost: string
    net_cost_reduction_usd: string
    cost_efficiency_gain: string
  }
}
