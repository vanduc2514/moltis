from __future__ import annotations


class MoltisSdkError(Exception):
    """Base SDK error."""


class DisabledError(MoltisSdkError):
    """GraphQL endpoint is disabled."""


class AuthError(MoltisSdkError):
    """Authentication or authorization failed."""


class GraphQLResponseError(MoltisSdkError):
    """GraphQL returned one or more resolver errors."""

    def __init__(self, messages: list[str]) -> None:
        self.messages = messages
        super().__init__(" | ".join(messages) or "GraphQL request failed")


class TransportError(MoltisSdkError):
    """Transport-level error."""
