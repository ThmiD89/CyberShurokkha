from flask import Flask, request, jsonify
from flask_cors import CORS
from scan_and_check import scan_and_check, looks_like_url
import os
import psycopg2
import uuid
import json
from datetime import datetime
from urllib.parse import urlparse

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ========== DATABASE CONNECTION ==========
def get_db_connection():
    return psycopg2.connect(
        host="localhost",
        database="cybershurokkha",
        user="cyberadmin",
        password="cyberpass123",
        port=5432
    )


def save_url_scan(url, risk_score, risk_level, reasons, source_type="direct_url"):
    """Save URL scan result to PostgreSQL."""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Parse URL for domain
        parsed = urlparse(url if url.startswith('http') else 'http://' + url)
        domain = parsed.netloc or parsed.path
        
        # Check if uses HTTPS
        uses_https = url.startswith('https://')
        
        # Check if shortened (common shorteners)
        shortened_domains = ['bit.ly', 'tinyurl.com', 'goo.gl', 'ow.ly', 'is.gd', 'buff.ly', 'shorturl.at']
        is_shortened = any(d in domain for d in shortened_domains)
        
        # Check for login keywords
        login_keywords = ['login', 'signin', 'secure', 'account', 'verify', 'update', 'bank', 'payment']
        has_login_keyword = any(k in url.lower() for k in login_keywords)
        
        # Check suspicious TLD
        suspicious_tlds = ['.tk', '.ml', '.ga', '.cf', '.top', '.xyz', '.club', '.online', '.site']
        suspicious_tld = any(url.lower().endswith(tld) for tld in suspicious_tlds)
        
        scan_id = str(uuid.uuid4())
        
        cur.execute("""
            INSERT INTO url_scans (
                id, user_id, source_type, original_input, resolved_url,
                domain, uses_https, is_shortened, has_login_keyword,
                suspicious_tld, risk_score, risk_level, reasons, created_at
            ) VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
            )
        """, (
            scan_id,
            None,  # user_id (anonymous)
            source_type,
            url,
            url,  # resolved_url (same for now)
            domain,
            uses_https,
            is_shortened,
            has_login_keyword,
            suspicious_tld,
            risk_score,
            risk_level,
            json.dumps(reasons),
            datetime.now()
        ))
        
        conn.commit()
        cur.close()
        conn.close()
        print(f"✅ URL scan saved to database: {scan_id}")
        return True
    except Exception as e:
        print(f"❌ Error saving URL scan: {e}")
        return False


# ========== ROUTES ==========
@app.route('/', methods=['GET'])
def index():
    return jsonify({"status": "QR Scanner API is running"}), 200


@app.route('/check_url', methods=['POST'])
def check_url():
    """Check a URL from manual input or QR code."""
    data = request.get_json()
    if not data or 'url' not in data:
        return jsonify({'error': 'Missing URL'}), 400

    decoded = data.get('url', '').strip()
    if not decoded:
        return jsonify({'error': 'Empty URL'}), 400

    if not looks_like_url(decoded):
        return jsonify({'error': f'"{decoded}" does not look like a valid URL'}), 400

    from predict_live import predict_url_uci
    result = predict_url_uci(decoded)
    result['decoded_from_qr'] = True
    result['confidence'] = float(result['confidence'])
    
    # Determine risk score and level from verdict
    if result['verdict'] == 'SAFE':
        risk_score = max(0, 100 - int(result['confidence']))
        risk_level = 'safe'
        reasons = [f"URL appears safe (confidence: {result['confidence']}%)"]
    else:
        risk_score = int(result['confidence'])
        risk_level = 'dangerous'
        reasons = [f"Phishing detected (confidence: {result['confidence']}%)", "URL matches known phishing patterns"]
    
    # Save to database
    save_url_scan(
        url=decoded,
        risk_score=risk_score,
        risk_level=risk_level,
        reasons=reasons,
        source_type="qr_upload" if result.get('decoded_from_qr') else "direct_url"
    )
    
    return jsonify(result)


@app.route('/upload_qr', methods=['POST'])
def upload_qr():
    """Upload QR image, decode and check URL."""
    if 'qr_image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    file = request.files['qr_image']
    if file.filename == '':
        return jsonify({'error': 'Empty filename'}), 400

    # Save temporarily
    path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(path)

    try:
        result = scan_and_check(path)
        # Clean up
        os.remove(path)
        
        if 'error' in result:
            return jsonify({'error': result['error']}), 400
        
        result['confidence'] = float(result['confidence'])
        
        # Save to database
        if result['verdict'] == 'SAFE':
            risk_score = max(0, 100 - int(result['confidence']))
            risk_level = 'safe'
            reasons = [f"URL appears safe (confidence: {result['confidence']}%)"]
        else:
            risk_score = int(result['confidence'])
            risk_level = 'dangerous'
            reasons = [f"Phishing detected (confidence: {result['confidence']}%)"]
        
        save_url_scan(
            url=result['url'],
            risk_score=risk_score,
            risk_level=risk_level,
            reasons=reasons,
            source_type="qr_upload"
        )
        
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)