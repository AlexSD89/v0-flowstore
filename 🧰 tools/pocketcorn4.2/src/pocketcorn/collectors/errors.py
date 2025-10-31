"""Custom exceptions for collector operations."""
from __future__ import annotations


class CollectorError(Exception):
    """Base error for collectors."""


class RateLimitError(CollectorError):
    """Raised when a platform indicates rate limiting."""


class PlatformUnavailableError(CollectorError):
    """Raised when a platform cannot be reached."""
