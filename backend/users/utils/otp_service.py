import random
from datetime import datetime, timedelta
from django.core.cache import cache

def generate_otp(length=6):
    return ''.join([str(random.randint(0, 9)) for _ in range(length)])

def store_otp(username, otp, expiry_minutes=5):
    expiry_time = datetime.now() + timedelta(minutes=expiry_minutes)
    cache.set(f"otp_{username}", {"otp": otp, "expiry": expiry_time}, timeout=expiry_minutes * 60)

def verify_otp(username, input_otp):
    otp_data = cache.get(f"otp_{username}")
    if not otp_data:
        return False, "OTP expired or not found."
    if int(otp_data["otp"]) != input_otp:
        return False, "Invalid OTP."
    if datetime.now() > otp_data["expiry"]:
        return False, "OTP expired."
    return True, "OTP verified successfully."
