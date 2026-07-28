from database import SessionLocal
from models import District

districts_data = [
    # Dhaka Division
    ("Dhaka", "ঢাকা", "Dhaka Division"),
    ("Faridpur", "ফরিদপুর", "Dhaka Division"),
    ("Gazipur", "গাজীপুর", "Dhaka Division"),
    ("Gopalganj", "গোপালগঞ্জ", "Dhaka Division"),
    ("Kishoreganj", "কিশোরগঞ্জ", "Dhaka Division"),
    ("Madaripur", "মাদারীপুর", "Dhaka Division"),
    ("Manikganj", "মানিকগঞ্জ", "Dhaka Division"),
    ("Munshiganj", "মুন্সিগঞ্জ", "Dhaka Division"),
    ("Narayanganj", "নারায়ণগঞ্জ", "Dhaka Division"),
    ("Narsingdi", "নরসিংদী", "Dhaka Division"),
    ("Rajbari", "রাজবাড়ী", "Dhaka Division"),
    ("Shariatpur", "শরীয়তপুর", "Dhaka Division"),
    ("Tangail", "টাঙ্গাইল", "Dhaka Division"),

    # Chattogram Division
    ("Chattogram", "চট্টগ্রাম", "Chattogram Division"),
    ("Bandarban", "বান্দরবান", "Chattogram Division"),
    ("Brahmanbaria", "ব্রাহ্মণবাড়িয়া", "Chattogram Division"),
    ("Chandpur", "চাঁদপুর", "Chattogram Division"),
    ("Cumilla", "কুমিল্লা", "Chattogram Division"),
    ("Cox's Bazar", "কক্সবাজার", "Chattogram Division"),
    ("Feni", "ফেনী", "Chattogram Division"),
    ("Khagrachhari", "খাগড়াছড়ি", "Chattogram Division"),
    ("Lakshmipur", "লক্ষ্মীপুর", "Chattogram Division"),
    ("Noakhali", "নোয়াখালী", "Chattogram Division"),
    ("Rangamati", "রাঙ্গামাটি", "Chattogram Division"),

    # Rajshahi Division
    ("Rajshahi", "রাজশাহী", "Rajshahi Division"),
    ("Bogura", "বগুড়া", "Rajshahi Division"),
    ("Joypurhat", "জয়পুরহাট", "Rajshahi Division"),
    ("Naogaon", "নওগাঁ", "Rajshahi Division"),
    ("Natore", "নাটোর", "Rajshahi Division"),
    ("Chapai Nawabganj", "চাঁপাইনবাবগঞ্জ", "Rajshahi Division"),
    ("Pabna", "পাবনা", "Rajshahi Division"),
    ("Sirajganj", "সিরাজগঞ্জ", "Rajshahi Division"),

    # Khulna Division
    ("Khulna", "খুলনা", "Khulna Division"),
    ("Bagerhat", "বাগেরহাট", "Khulna Division"),
    ("Chuadanga", "চুয়াডাঙ্গা", "Khulna Division"),
    ("Jashore", "যশোর", "Khulna Division"),
    ("Jhenaidah", "ঝিনাইদহ", "Khulna Division"),
    ("Kushtia", "কুষ্টিয়া", "Khulna Division"),
    ("Magura", "মাগুরা", "Khulna Division"),
    ("Meherpur", "মেহেরপুর", "Khulna Division"),
    ("Narail", "নড়াইল", "Khulna Division"),
    ("Satkhira", "সাতক্ষীরা", "Khulna Division"),

    # Barisal Division
    ("Barisal", "বরিশাল", "Barisal Division"),
    ("Barguna", "বরগুনা", "Barisal Division"),
    ("Bhola", "ভোলা", "Barisal Division"),
    ("Jhalokati", "ঝালকাঠি", "Barisal Division"),
    ("Patuakhali", "পটুয়াখালী", "Barisal Division"),
    ("Pirojpur", "পিরোজপুর", "Barisal Division"),

    # Sylhet Division
    ("Sylhet", "সিলেট", "Sylhet Division"),
    ("Habiganj", "হবিগঞ্জ", "Sylhet Division"),
    ("Moulvibazar", "মৌলভীবাজার", "Sylhet Division"),
    ("Sunamganj", "সুনামগঞ্জ", "Sylhet Division"),

    # Rangpur Division
    ("Rangpur", "রংপুর", "Rangpur Division"),
    ("Dinajpur", "দিনাজপুর", "Rangpur Division"),
    ("Gaibandha", "গাইবান্ধা", "Rangpur Division"),
    ("Kurigram", "কুড়িগ্রাম", "Rangpur Division"),
    ("Lalmonirhat", "লালমনিরহাট", "Rangpur Division"),
    ("Nilphamari", "নীলফামারী", "Rangpur Division"),
    ("Panchagarh", "পঞ্চগড়", "Rangpur Division"),
    ("Thakurgaon", "ঠাকুরগাঁও", "Rangpur Division"),

    # Mymensingh Division
    ("Mymensingh", "ময়মনসিংহ", "Mymensingh Division"),
    ("Jamalpur", "জামালপুর", "Mymensingh Division"),
    ("Netrokona", "নেত্রকোণা", "Mymensingh Division"),
    ("Sherpur", "শেরপুর", "Mymensingh Division"),
]

def seed():
    db = SessionLocal()
    existing_count = db.query(District).count()
    if existing_count > 0:
        print(f"Districts table already has {existing_count} rows — skipping seed to avoid duplicates.")
        db.close()
        return

    for name_en, name_bn, division in districts_data:
        db.add(District(name_en=name_en, name_bn=name_bn, division=division))

    db.commit()
    print(f"Seeded {len(districts_data)} districts successfully.")
    db.close()

if __name__ == "__main__":
    seed()