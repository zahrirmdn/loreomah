# backend/email_service.py
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", SMTP_USER)

def send_otp_email(to_email: str, otp_code: str, username: str = ""):
    """Send OTP verification email to user"""
    
    if not SMTP_USER or not SMTP_PASSWORD:
        print("⚠️ SMTP credentials not configured. OTP email not sent.")
        print(f"📧 OTP Code for {to_email}: {otp_code}")
        return True
    
    subject = "Kode Verifikasi OTP - Cafe Loreomah"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #6A4C2E 0%, #8B6F47 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
            .otp-box {{ background: white; border: 2px solid #6A4C2E; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }}
            .otp-code {{ font-size: 32px; font-weight: bold; color: #6A4C2E; letter-spacing: 8px; }}
            .footer {{ text-align: center; color: #666; font-size: 12px; margin-top: 20px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🏞️ Cafe Loreomah</h1>
                <p>Verifikasi Akun Anda</p>
            </div>
            <div class="content">
                <h2>Halo{' ' + username if username else ''}!</h2>
                <p>Terima kasih telah mendaftar di Cafe Loreomah. Untuk melanjutkan, silakan verifikasi email Anda dengan memasukkan kode OTP berikut:</p>
                
                <div class="otp-box">
                    <p style="margin: 0; color: #666; font-size: 14px;">Kode Verifikasi OTP:</p>
                    <div class="otp-code">{otp_code}</div>
                </div>
                
                <p><strong>Kode ini berlaku selama 10 menit.</strong></p>
                <p>Jika Anda tidak melakukan pendaftaran, abaikan email ini.</p>
                
                <div class="footer">
                    <p>Email ini dikirim otomatis, mohon tidak membalas.</p>
                    <p>&copy; 2024 Cafe Loreomah. All rights reserved.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """
    
    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = FROM_EMAIL
        msg['To'] = to_email
        
        html_part = MIMEText(html_content, 'html')
        msg.attach(html_part)
        
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)
        
        print(f"✅ OTP email sent to {to_email}")
        return True
    except Exception as e:
        print(f"❌ Failed to send OTP email: {str(e)}")
        print(f"📧 OTP Code for {to_email}: {otp_code}")
        return False


def send_reservation_confirmation_email(to_email: str, reservation_data: dict):
    """Send reservation confirmation email to user"""
    
    if not SMTP_USER or not SMTP_PASSWORD:
        print("⚠️ SMTP credentials not configured. Confirmation email not sent.")
        print(f"📧 Reservation confirmed for {to_email}")
        return True
    
    subject = "✅ Reservasi Dikonfirmasi - Cafe Loreomah"
    
    # Format date for display (convert to WIB/Jakarta timezone UTC+7)
    from datetime import datetime, timezone, timedelta
    import urllib.parse
    
    try:
        date_obj = datetime.fromisoformat(reservation_data.get('date', '').replace('Z', '+00:00'))
        # Convert to WIB (UTC+7)
        wib_offset = timedelta(hours=7)
        date_wib = date_obj.astimezone(timezone(wib_offset))
        formatted_date = date_wib.strftime("%d %B %Y")
        formatted_time = date_wib.strftime("%H:%M")
    except:
        formatted_date = reservation_data.get('date', '-')
        formatted_time = ""
    
    # Create WhatsApp message
    whatsapp_number = "6282142433998"  # Format: country code + number (without +)
    whatsapp_message = f"""Halo Cafe Loreomah, saya mau konfirmasi reservasi:

Atas Nama: {reservation_data.get('name', '-')}
Tanggal: {formatted_date}
Jam: {formatted_time}
Jumlah Tamu: {reservation_data.get('guests', 0)} orang
No. Telepon: {reservation_data.get('phone', '-')}

Terima kasih!"""
    
    whatsapp_url = f"https://wa.me/{whatsapp_number}?text={urllib.parse.quote(whatsapp_message)}"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #6A4C2E 0%, #8B6F47 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
            .info-box {{ background: white; border-left: 4px solid #6A4C2E; padding: 20px; margin: 20px 0; }}
            .info-row {{ display: flex; padding: 10px 0; border-bottom: 1px solid #eee; }}
            .info-label {{ font-weight: bold; color: #6A4C2E; min-width: 150px; }}
            .info-value {{ color: #333; }}
            .status-badge {{ background: #22c55e; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; font-weight: bold; }}
            .footer {{ text-align: center; color: #666; font-size: 12px; margin-top: 20px; }}
            .highlight {{ background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107; }}
            .whatsapp-btn {{ background: #25D366; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; margin: 20px 0; }}
            .whatsapp-btn:hover {{ background: #128C7E; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Cafe Loreomah</h1>
                <p>Konfirmasi Reservasi</p>
            </div>
            <div class="content">
                <div style="text-align: center; margin-bottom: 20px;">
                    <span class="status-badge">✅ RESERVASI DIKONFIRMASI</span>
                </div>
                
                <h2>Halo, {reservation_data.get('name', 'Pelanggan')}!</h2>
                <p>Reservasi Anda telah <strong>dikonfirmasi</strong> oleh tim kami. Berikut detail reservasi Anda:</p>
                
                <div class="info-box">
                    <div class="info-row">
                        <div class="info-label">Nama Pemesan:</div>
                        <div class="info-value">{reservation_data.get('name', '-')}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">No. Telepon:</div>
                        <div class="info-value">{reservation_data.get('phone', '-')}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Tanggal:</div>
                        <div class="info-value">{formatted_date}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Jam:</div>
                        <div class="info-value">{formatted_time}</div>
                    </div>
                    <div class="info-row" style="border-bottom: none;">
                        <div class="info-label">Jumlah Tamu:</div>
                        <div class="info-value">{reservation_data.get('guests', 0)} orang</div>
                    </div>
                </div>
                
                <div class="highlight">
                    <strong>📍 Alamat Cafe:</strong><br>
                    Jl. Airlangga, Trawas, Kab. Mojokerto, Jawa Timur<br>
                    <strong>📞 Kontak:</strong> 0821-4243-3998
                </div>
                
                <div style="text-align: center; margin: 30px 0; background: #ffe5e5; padding: 20px; border-radius: 8px; border: 2px solid #ff4444;">
                    <p style="margin-bottom: 15px; color: #cc0000;"><strong>⚠️ WAJIB KONFIRMASI VIA WHATSAPP ⚠️</strong></p>
                    <p style="margin-bottom: 15px; font-size: 14px;">Untuk memastikan reservasi Anda, silakan konfirmasi melalui WhatsApp dengan klik tombol di bawah ini:</p>
                    <a href="{whatsapp_url}" class="whatsapp-btn" style="color: white;">
                        💬 Konfirmasi via WhatsApp SEKARANG
                    </a>
                    <p style="font-size: 12px; color: #666; margin-top: 10px;">
                        Pesan sudah terdraft otomatis dengan data reservasi Anda
                    </p>
                </div>
                
                <p><strong>Catatan Penting:</strong></p>
                <ul>
                    <li><strong>WAJIB konfirmasi via WhatsApp untuk memastikan reservasi Anda</strong></li>
                    <li>Harap datang tepat waktu sesuai jadwal reservasi</li>
                    <li>Jika ada perubahan, hubungi kami via WhatsApp minimal 2 jam sebelumnya</li>
                    <li>Simpan email ini sebagai bukti reservasi</li>
                </ul>
                
                <p>Kami menunggu kedatangan Anda. Terima kasih telah memilih Cafe Loreomah!</p>
                
                <div class="footer">
                    <p>Email ini dikirim otomatis dari sistem Cafe Loreomah.</p>
                    <p>&copy; 2024 Cafe Loreomah. All rights reserved.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """
    
    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = FROM_EMAIL
        msg['To'] = to_email
        
        html_part = MIMEText(html_content, 'html')
        msg.attach(html_part)
        
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)
        
        print(f"✅ Reservation confirmation email sent to {to_email}")
        return True
    except Exception as e:
        print(f"❌ Failed to send confirmation email: {str(e)}")
        print(f"📧 Reservation confirmed for {to_email}")
        return False
