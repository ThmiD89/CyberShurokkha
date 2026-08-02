from urllib.parse import unquote_plus


def decode_url(url):
    try:
        return unquote_plus(url)
    except Exception:
        return url