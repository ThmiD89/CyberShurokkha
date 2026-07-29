from database import SessionLocal
from models import District

coordinates = {
    # Dhaka Division
    "Dhaka": (23.8103, 90.4125), "Faridpur": (23.6070, 89.8429), "Gazipur": (23.9999, 90.4203),
    "Gopalganj": (23.0050, 89.8266), "Kishoreganj": (24.4449, 90.7766), "Madaripur": (23.1641, 90.1897),
    "Manikganj": (23.8644, 90.0047), "Munshiganj": (23.5422, 90.5305), "Narayanganj": (23.6238, 90.5000),
    "Narsingdi": (23.9322, 90.7150), "Rajbari": (23.7574, 89.6444), "Shariatpur": (23.2423, 90.4348),
    "Tangail": (24.2513, 89.9167),

    # Chattogram Division
    "Chattogram": (22.3569, 91.7832), "Bandarban": (22.1953, 92.2184), "Brahmanbaria": (23.9571, 91.1119),
    "Chandpur": (23.2333, 90.6667), "Cumilla": (23.4607, 91.1809), "Cox's Bazar": (21.4272, 92.0058),
    "Feni": (23.0159, 91.3976), "Khagrachhari": (23.1193, 91.9847), "Lakshmipur": (22.9447, 90.8282),
    "Noakhali": (22.8696, 91.0995), "Rangamati": (22.6533, 92.1789),

    # Rajshahi Division
    "Rajshahi": (24.3745, 88.6042), "Bogura": (24.8465, 89.3773), "Joypurhat": (25.0968, 89.0227),
    "Naogaon": (24.7936, 88.9318), "Natore": (24.4206, 88.9500), "Chapai Nawabganj": (24.5965, 88.2775),
    "Pabna": (24.0064, 89.2372), "Sirajganj": (24.4534, 89.7000),

    # Khulna Division
    "Khulna": (22.8456, 89.5403), "Bagerhat": (22.6602, 89.7895), "Chuadanga": (23.6402, 88.8410),
    "Jashore": (23.1667, 89.2167), "Jhenaidah": (23.5448, 89.1539), "Kushtia": (23.9013, 89.1200),
    "Magura": (23.4873, 89.4198), "Meherpur": (23.7622, 88.6318), "Narail": (23.1725, 89.5126),
    "Satkhira": (22.7185, 89.0705),

    # Barisal Division
    "Barisal": (22.7010, 90.3535), "Barguna": (22.1591, 90.1128), "Bhola": (22.6859, 90.6482),
    "Jhalokati": (22.6406, 90.1987), "Patuakhali": (22.3596, 90.3296), "Pirojpur": (22.5841, 89.9720),

    # Sylhet Division
    "Sylhet": (24.8949, 91.8687), "Habiganj": (24.3745, 91.4155), "Moulvibazar": (24.4829, 91.7774),
    "Sunamganj": (25.0658, 91.3950),

    # Rangpur Division
    "Rangpur": (25.7439, 89.2752), "Dinajpur": (25.6279, 88.6332), "Gaibandha": (25.3288, 89.5285),
    "Kurigram": (25.8054, 89.6362), "Lalmonirhat": (25.9923, 89.2847), "Nilphamari": (25.9317, 88.8560),
    "Panchagarh": (26.3411, 88.5541), "Thakurgaon": (26.0336, 88.4616),

    # Mymensingh Division
    "Mymensingh": (24.7471, 90.4203), "Jamalpur": (24.9375, 89.9372), "Netrokona": (24.8829, 90.7276),
    "Sherpur": (25.0200, 90.0153),
}

def run():
    db = SessionLocal()
    updated = 0
    for district in db.query(District).all():
        if district.name_en in coordinates:
            lat, lng = coordinates[district.name_en]
            district.centroid_lat = str(lat)
            district.centroid_lng = str(lng)
            updated += 1
        else:
            print(f"No coordinates found for: {district.name_en}")
    db.commit()
    print(f"Updated {updated} districts with coordinates.")
    db.close()

if __name__ == "__main__":
    run()