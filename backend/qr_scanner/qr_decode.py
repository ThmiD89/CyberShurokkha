import cv2
import numpy as np

def scan_qr(image_path):
    """Decodes QR code using OpenCV with multiple preprocessing attempts."""
    try:
        img = cv2.imread(image_path)
        if img is None:
            return None
        
        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        detector = cv2.QRCodeDetector()
        
        # Try multiple methods
        methods = [
            ("original", img),
            ("grayscale", gray),
            ("enhanced", cv2.convertScaleAbs(gray, alpha=1.5, beta=30)),
            ("threshold", cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)[1]),
            ("adaptive", cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2))
        ]
        
        for name, image in methods:
            try:
                data, bbox, _ = detector.detectAndDecode(image)
                if data:
                    print(f"QR detected using {name} method")
                    return data
            except:
                continue
        
        return None
    except Exception as e:
        print(f"Error scanning QR: {e}")
        return None

if __name__ == "__main__":
    test_image = 'test_qr.png'
    url = scan_qr(test_image)
    print("Decoded URL:", url)