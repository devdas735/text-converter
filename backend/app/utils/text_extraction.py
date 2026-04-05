from pathlib import Path


class UnsupportedFileTypeError(ValueError):
    """Raised when text extraction is requested for an unsupported file extension."""


def _clean_text(text: str) -> str:
    """Normalize whitespace and return cleaned text."""
    return ' '.join(text.split()).strip()


def extract_text_from_txt(file_path: str | Path) -> str:
    path = Path(file_path)
    text = path.read_text(encoding='utf-8', errors='ignore')
    return _clean_text(text)


def extract_text_from_docx(file_path: str | Path) -> str:
    try:
        from docx import Document
    except ImportError as exc:
        raise RuntimeError('python-docx is required for .docx extraction') from exc

    path = Path(file_path)
    doc = Document(str(path))
    text = '\n'.join(paragraph.text for paragraph in doc.paragraphs)
    return _clean_text(text)


def extract_text_from_pdf(file_path: str | Path) -> str:
    try:
        from pypdf import PdfReader
    except ImportError as exc:
        raise RuntimeError('pypdf is required for .pdf extraction') from exc

    path = Path(file_path)
    reader = PdfReader(str(path))
    page_text: list[str] = []

    for page in reader.pages:
        page_text.append(page.extract_text() or '')

    text = '\n'.join(page_text)
    return _clean_text(text)


def extract_text_from_file(file_path: str | Path) -> str:
    path = Path(file_path)

    if not path.exists() or not path.is_file():
        raise FileNotFoundError(f'File not found: {path}')

    extension = path.suffix.lower()

    if extension == '.txt':
        return extract_text_from_txt(path)
    if extension == '.docx':
        return extract_text_from_docx(path)
    if extension == '.pdf':
        return extract_text_from_pdf(path)

    raise UnsupportedFileTypeError(
        f'Unsupported file extension: {extension or "<none>"}. Supported: .txt, .docx, .pdf'
    )
