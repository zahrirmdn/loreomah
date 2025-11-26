import httpx
import logging
from typing import Optional

logger = logging.getLogger(__name__)

WHATSAPP_BOT_URL = "http://localhost:3001"

async def send_whatsapp_message(phone: str, message: str) -> bool:
    """
    Kirim pesan WhatsApp ke nomor tertentu
    
    Args:
        phone: Nomor telepon (format: 628xxx atau 08xxx)
        message: Isi pesan
        
    Returns:
        bool: True jika berhasil, False jika gagal
    """
    try:
        # Normalisasi nomor telepon
        phone_clean = phone.replace("+", "").replace("-", "").replace(" ", "")
        if phone_clean.startswith("0"):
            phone_clean = "62" + phone_clean[1:]
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{WHATSAPP_BOT_URL}/send-message",
                json={"phone": phone_clean, "message": message}
            )
            
            if response.status_code == 200:
                logger.info(f"✅ Pesan WA berhasil dikirim ke {phone_clean}")
                return True
            else:
                logger.error(f"❌ Gagal kirim WA: {response.text}")
                return False
                
    except Exception as e:
        logger.error(f"❌ Error kirim WA ke {phone}: {str(e)}")
        return False

async def check_whatsapp_status() -> dict:
    """Cek status WhatsApp bot"""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(f"{WHATSAPP_BOT_URL}/status")
            return response.json()
    except Exception as e:
        logger.error(f"Error checking WA status: {e}")
        return {"ready": False, "error": str(e)}

def format_reservation_confirmation_message(name: str, date: str, time: str, guests: int, confirmation_link: str) -> str:
    """Format pesan konfirmasi reservasi"""
    return f"""🍽️ *Konfirmasi Reservasi Cafe Loreomah*

Halo {name}! 👋

Terima kasih telah melakukan reservasi di Cafe Loreomah.

📅 *Detail Reservasi:*
• Tanggal: {date}
• Waktu: {time}
• Jumlah Tamu: {guests} orang

⚠️ *Mohon konfirmasi reservasi Anda* dengan klik link berikut:
{confirmation_link}

Reservasi akan otomatis dibatalkan jika tidak dikonfirmasi dalam 24 jam.

Terima kasih! 🙏
_Cafe Loreomah - Suasana Sejuk Pedesaan_"""

def format_reservation_approved_message(name: str, date: str, time: str, guests: int) -> str:
    """Format pesan reservasi disetujui admin"""
    return f"""✅ *Reservasi Disetujui!*

Halo {name}! 👋

Reservasi Anda di Cafe Loreomah telah disetujui! 🎉

📅 *Detail Reservasi:*
• Tanggal: {date}
• Waktu: {time}
• Jumlah Tamu: {guests} orang

📍 *Lokasi:*
Jl. Airlangga, Sumbersari, Kesiman
Kec. Trawas, Kab. Mojokerto, Jawa Timur 61375

⏰ *Jam Buka:*
Senin-Jumat: 09.00 - 19.00
Sabtu-Minggu: 09.00 - 20.00

Kami tunggu kedatangan Anda! 😊

_Cafe Loreomah - Suasana Sejuk Pedesaan_"""

def format_reservation_declined_message(name: str, date: str, time: str) -> str:
    """Format pesan reservasi ditolak"""
    return f"""❌ *Reservasi Tidak Dapat Diproses*

Halo {name},

Mohon maaf, reservasi Anda untuk tanggal {date} pukul {time} tidak dapat kami proses karena kapasitas penuh.

Silakan pilih waktu lain atau hubungi kami untuk informasi lebih lanjut:
📞 0821-4243-3998

Terima kasih atas pengertiannya.

_Cafe Loreomah_"""
