#!/usr/bin/env python3
"""
Synthetic Content Moderation Dataset Generator (ApexTrust Operations)
Synthesizes 2,800+ realistic operational moderation records conforming strictly to the
18-column canonical schema. Simulates trust and safety queue dynamics, HITL triage,
SLA breaches, QA audit errors, and appeal overturn trajectories with zero PII.
"""

import argparse
import csv
from datetime import datetime, timedelta
import random

REQUIRED_COLUMNS = [
    'Review_ID',
    'Timestamp',
    'Agent_ID',
    'Tenure_Group',
    'Queue_Name',
    'Content_Type',
    'Egregious_Flag',
    'HITL_Routing',
    'AHT_Seconds',
    'TAT_Minutes',
    'SLA_Breached',
    'Decision_Action',
    'QA_Audited',
    'QA_Score',
    'Error_Type',
    'Appealed_Flag',
    'Overturned_Flag',
    'Content_Snippet'
]

AGENTS = {
    'AGENT_01': {'tenure': 'New Hire (<30d)', 'aht_mult': 1.35, 'qa_err_prob': 0.07},
    'AGENT_02': {'tenure': 'New Hire (<30d)', 'aht_mult': 1.30, 'qa_err_prob': 0.06},
    'AGENT_03': {'tenure': 'New Hire (<30d)', 'aht_mult': 1.25, 'qa_err_prob': 0.06},
    'AGENT_04': {'tenure': 'Core (1-6mo)', 'aht_mult': 1.05, 'qa_err_prob': 0.03},
    'AGENT_05': {'tenure': 'Core (1-6mo)', 'aht_mult': 1.00, 'qa_err_prob': 0.025},
    'AGENT_06': {'tenure': 'Core (1-6mo)', 'aht_mult': 0.98, 'qa_err_prob': 0.02},
    'AGENT_07': {'tenure': 'Core (1-6mo)', 'aht_mult': 1.02, 'qa_err_prob': 0.025},
    'AGENT_08': {'tenure': 'Core (1-6mo)', 'aht_mult': 0.95, 'qa_err_prob': 0.02},
    'AGENT_09': {'tenure': 'Core (1-6mo)', 'aht_mult': 1.01, 'qa_err_prob': 0.025},
    'AGENT_10': {'tenure': 'Core (1-6mo)', 'aht_mult': 0.96, 'qa_err_prob': 0.02},
    'AGENT_11': {'tenure': 'Core (1-6mo)', 'aht_mult': 0.94, 'qa_err_prob': 0.018},
    'AGENT_12': {'tenure': 'Senior (6mo+)', 'aht_mult': 0.85, 'qa_err_prob': 0.008},
    'AGENT_13': {'tenure': 'Senior (6mo+)', 'aht_mult': 0.82, 'qa_err_prob': 0.006},
    'AGENT_14': {'tenure': 'Senior (6mo+)', 'aht_mult': 0.80, 'qa_err_prob': 0.005},
    'AGENT_15': {'tenure': 'Senior (6mo+)', 'aht_mult': 0.78, 'qa_err_prob': 0.005},
}

QUEUES = [
    'Violence_HighRisk',
    'Hate_Speech',
    'Fraud_Scams',
    'Spam_Commercial',
    'Emergency_TCO',
]

CONTENT_TYPES = ['Text_Post', 'Static_Image', 'Short_Video', 'Live_Stream']

SNIPPETS = {
    'Violence_HighRisk': [
        'Reported altercation outside transit station with physical violence',
        'Dangerous weapons demonstration video flagged for policy violation',
        'Graphic injury footage from sports accident flagged by audience',
        'Threatening physical altercation clip uploaded without contextual warning',
        'Self-harm reference in private broadcast requiring immediate crisis triage'
    ],
    'Hate_Speech': [
        'Derogatory slur targeting protected demographic in comment section',
        'Dehumanizing memes comparing ethnic groups to biological pests',
        'Incitement to boycott and harass private individual based on religion',
        'Nuanced political satire flagged by automated keyword filter as hate',
        'Coordinated brigading comments containing coded discriminatory dogwhistles'
    ],
    'Fraud_Scams': [
        'Phishing link impersonating official platform customer verification support',
        'Cryptocurrency investment scheme promising guaranteed 500% daily returns',
        'Counterfeit luxury goods listing utilizing stolen trademark imagery',
        'Unauthorized credential harvesting page embedded in bio link',
        'Gift card prize sweepstakes scam targeting senior account holders'
    ],
    'Spam_Commercial': [
        'Automated script posting identical promotional link 120 times in forum',
        'Unsolicited commercial affiliate marketing message blast',
        'Repetitive bot activity promoting unverified pharmaceutical supplements',
        'Bulk account creation posting duplicate SEO spam articles',
        'Keyword stuffing and hidden redirects on promotional landing page'
    ],
    'Emergency_TCO': [
        'Suspected terrorist recruitment video uploaded across multiple hashtags',
        'Urgent notice-and-action request under EU 1-hour removal mandate',
        'Violent extremist manifestos distribution attempt flagged by cross-platform hash',
        'Coordinated tactical propaganda audio recording flagged by intelligence unit',
        'Emergency legal escalation concerning imminent threat of platform violence'
    ]
}

def generate_records(num_records=2800, seed=42):
    random.seed(seed)
    start_date = datetime(2026, 9, 6, 8, 0, 0)
    end_date = datetime(2026, 10, 5, 22, 0, 0)
    total_seconds = int((end_date - start_date).total_seconds())

    records = []
    agent_keys = list(AGENTS.keys())

    for i in range(1, num_records + 1):
        review_id = f"MOD-2026-{10000 + i}"

        # Hourly diurnal distribution: more volume during midday (11am-8pm)
        # Incident spike simulation between days 18-21 (Sept 24 - Sept 27)
        offset_secs = random.randint(0, total_seconds)
        record_time = start_date + timedelta(seconds=offset_secs)
        day_offset = (record_time - start_date).days
        is_incident_window = (18 <= day_offset <= 21)

        # Diurnal curve weighting
        hour = record_time.hour
        is_peak_hours = (9 <= hour <= 21)

        # Queue selection (weighted)
        if is_incident_window:
            queue = random.choices(
                QUEUES,
                weights=[0.35, 0.25, 0.15, 0.15, 0.10],
                k=1
            )[0]
        else:
            queue = random.choices(
                QUEUES,
                weights=[0.20, 0.25, 0.25, 0.25, 0.05],
                k=1
            )[0]

        # Content Type selection
        if queue in ['Violence_HighRisk', 'Emergency_TCO']:
            content_type = random.choices(
                CONTENT_TYPES,
                weights=[0.10, 0.25, 0.45, 0.20],
                k=1
            )[0]
            egregious = 1 if (queue == 'Emergency_TCO' or random.random() < 0.70) else 0
        elif queue == 'Hate_Speech':
            content_type = random.choices(
                CONTENT_TYPES,
                weights=[0.55, 0.25, 0.15, 0.05],
                k=1
            )[0]
            egregious = 1 if random.random() < 0.20 else 0
        elif queue == 'Fraud_Scams':
            content_type = random.choices(
                CONTENT_TYPES,
                weights=[0.40, 0.45, 0.12, 0.03],
                k=1
            )[0]
            egregious = 0
        else: # Spam_Commercial
            content_type = random.choices(
                CONTENT_TYPES,
                weights=[0.65, 0.25, 0.08, 0.02],
                k=1
            )[0]
            egregious = 0

        # HITL Routing
        if queue == 'Spam_Commercial':
            routing = random.choices(
                ['Auto_Approved', 'Auto_Rejected', 'Manual_Review', 'Tier2_Escalated'],
                weights=[0.40, 0.35, 0.23, 0.02],
                k=1
            )[0]
        elif queue == 'Emergency_TCO':
            routing = random.choices(
                ['Auto_Approved', 'Auto_Rejected', 'Manual_Review', 'Tier2_Escalated'],
                weights=[0.02, 0.25, 0.45, 0.28],
                k=1
            )[0]
        elif queue == 'Violence_HighRisk':
            routing = random.choices(
                ['Auto_Approved', 'Auto_Rejected', 'Manual_Review', 'Tier2_Escalated'],
                weights=[0.08, 0.22, 0.55, 0.15],
                k=1
            )[0]
        else:
            routing = random.choices(
                ['Auto_Approved', 'Auto_Rejected', 'Manual_Review', 'Tier2_Escalated'],
                weights=[0.20, 0.20, 0.52, 0.08],
                k=1
            )[0]

        # Assign Agent (Senior agents take more Tier2 escalations)
        if routing == 'Tier2_Escalated':
            agent_id = random.choice(['AGENT_12', 'AGENT_13', 'AGENT_14', 'AGENT_15'])
        elif routing in ['Auto_Approved', 'Auto_Rejected']:
            # Automated decisions still assigned a supervisory system reviewer for audit tracking
            agent_id = random.choice(agent_keys)
        else:
            agent_id = random.choice(agent_keys)

        agent_meta = AGENTS[agent_id]
        tenure = agent_meta['tenure']

        # Base AHT by Content Type
        if content_type == 'Text_Post':
            base_aht = random.uniform(18.0, 42.0)
        elif content_type == 'Static_Image':
            base_aht = random.uniform(32.0, 78.0)
        elif content_type == 'Short_Video':
            base_aht = random.uniform(95.0, 210.0)
        else: # Live_Stream
            base_aht = random.uniform(180.0, 340.0)

        # Apply agent multiplier and queue complexity
        if queue in ['Violence_HighRisk', 'Emergency_TCO']:
            queue_mult = 1.25
        elif queue == 'Hate_Speech':
            queue_mult = 1.15
        elif queue == 'Spam_Commercial':
            queue_mult = 0.70
        else:
            queue_mult = 1.00

        if routing in ['Auto_Approved', 'Auto_Rejected']:
            aht = round(random.uniform(2.5, 6.0), 1)
        else:
            aht = round(base_aht * agent_meta['aht_mult'] * queue_mult, 1)

        # TAT (Turnaround Time in minutes)
        # Standard queues target: 120-240 mins. Emergency TCO target: <60 mins.
        if is_incident_window:
            tat_multiplier = 1.85
        else:
            tat_multiplier = 1.00

        if queue == 'Emergency_TCO':
            base_tat = random.uniform(15.0, 75.0) * tat_multiplier
            sla_threshold = 60.0 # 1-hour legal TCO mandate
        elif queue == 'Violence_HighRisk':
            base_tat = random.uniform(30.0, 260.0) * tat_multiplier
            sla_threshold = 180.0
        elif queue == 'Hate_Speech':
            base_tat = random.uniform(45.0, 320.0) * tat_multiplier
            sla_threshold = 240.0
        else:
            base_tat = random.uniform(20.0, 220.0) * tat_multiplier
            sla_threshold = 240.0

        tat = round(base_tat, 1)
        sla_breached = 1 if tat > sla_threshold else 0

        # Decision Action
        if routing == 'Auto_Approved':
            action = 'Approve_Keep'
        elif routing == 'Auto_Rejected':
            action = 'Remove_Delete'
        elif queue == 'Spam_Commercial':
            action = random.choices(
                ['Approve_Keep', 'Remove_Delete', 'Content_Warning', 'Account_Suspend', 'Escalate'],
                weights=[0.25, 0.60, 0.05, 0.08, 0.02],
                k=1
            )[0]
        elif queue == 'Emergency_TCO':
            action = random.choices(
                ['Approve_Keep', 'Remove_Delete', 'Content_Warning', 'Account_Suspend', 'Escalate'],
                weights=[0.05, 0.70, 0.05, 0.12, 0.08],
                k=1
            )[0]
        elif queue == 'Violence_HighRisk':
            action = random.choices(
                ['Approve_Keep', 'Remove_Delete', 'Content_Warning', 'Account_Suspend', 'Escalate'],
                weights=[0.18, 0.55, 0.18, 0.05, 0.04],
                k=1
            )[0]
        elif queue == 'Fraud_Scams':
            action = random.choices(
                ['Approve_Keep', 'Remove_Delete', 'Content_Warning', 'Account_Suspend', 'Escalate'],
                weights=[0.12, 0.65, 0.03, 0.18, 0.02],
                k=1
            )[0]
        else: # Hate Speech
            action = random.choices(
                ['Approve_Keep', 'Remove_Delete', 'Content_Warning', 'Account_Suspend', 'Escalate'],
                weights=[0.32, 0.48, 0.14, 0.04, 0.02],
                k=1
            )[0]

        # QA Audit Mechanics (~12% audit sampling rate)
        qa_audited = 1 if random.random() < 0.12 else 0
        if qa_audited == 1:
            err_prob = agent_meta['qa_err_prob']
            if is_incident_window:
                err_prob *= 1.40 # Fatigue/confusion during surge
            has_error = (random.random() < err_prob)

            if not has_error:
                qa_score = 100.0
                error_type = 'None'
            else:
                qa_score = round(random.choice([0.0, 75.0, 80.0, 85.0]), 1)
                # If content was kept but should be removed: False Negative (platform safety risk)
                # If content was removed but should be kept: False Positive (frustrated user)
                # Wrong selection: correct removal, wrong tag
                if action == 'Approve_Keep':
                    error_type = 'False_Negative'
                elif action in ['Remove_Delete', 'Account_Suspend']:
                    error_type = random.choices(
                        ['False_Positive', 'Wrong_Selection'],
                        weights=[0.65, 0.35],
                        k=1
                    )[0]
                else:
                    error_type = random.choice(['False_Positive', 'False_Negative', 'Wrong_Selection'])
        else:
            qa_score = 0.0
            error_type = 'None'

        # Appeals & Overturn mechanics
        # Content that was removed or restricted can be appealed by users
        if action in ['Remove_Delete', 'Account_Suspend', 'Content_Warning']:
            appealed = 1 if random.random() < 0.10 else 0
            if appealed == 1:
                # If it was audited as a False Positive, it is very likely overturned
                if error_type == 'False_Positive':
                    overturned = 1 if random.random() < 0.88 else 0
                else:
                    overturned = 1 if random.random() < 0.16 else 0
            else:
                overturned = 0
        else:
            appealed = 0
            overturned = 0

        # Contextual Snippet
        snippet = random.choice(SNIPPETS[queue])

        records.append({
            'Review_ID': review_id,
            'Timestamp': record_time.strftime('%Y-%m-%d %H:%M:%S'),
            'Agent_ID': agent_id,
            'Tenure_Group': tenure,
            'Queue_Name': queue,
            'Content_Type': content_type,
            'Egregious_Flag': egregious,
            'HITL_Routing': routing,
            'AHT_Seconds': aht,
            'TAT_Minutes': tat,
            'SLA_Breached': sla_breached,
            'Decision_Action': action,
            'QA_Audited': qa_audited,
            'QA_Score': qa_score,
            'Error_Type': error_type,
            'Appealed_Flag': appealed,
            'Overturned_Flag': overturned,
            'Content_Snippet': snippet
        })

    # Sort chronological
    records.sort(key=lambda x: x['Timestamp'])
    return records

def write_csv(records, output_path='dashboard-ready.csv'):
    with open(output_path, mode='w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=REQUIRED_COLUMNS)
        writer.writeheader()
        writer.writerows(records)
    print(f"Generated {len(records)} records to {output_path}")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Generate synthetic content moderation analytics data")
    parser.add_argument('--count', type=int, default=2800, help="Number of records to generate (default: 2800)")
    parser.add_argument('--out', type=str, default='dashboard-ready.csv', help="Output CSV path")
    parser.add_argument('--seed', type=int, default=42, help="Random seed")
    args = parser.parse_args()

    recs = generate_records(num_records=args.count, seed=args.seed)
    write_csv(recs, args.out)
