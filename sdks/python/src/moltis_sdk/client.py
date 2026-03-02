from __future__ import annotations

import json
import uuid
from collections.abc import AsyncGenerator, Mapping
from dataclasses import dataclass
from typing import Any

import httpx
from websockets.asyncio.client import connect
from websockets.typing import Subprotocol

from .errors import (
    AuthError,
    DisabledError,
    GraphQLResponseError,
    MoltisSdkError,
    TransportError,
)

JsonMap = Mapping[str, Any]


@dataclass(frozen=True)
class MoltisClientOptions:
    endpoint: str
    api_key: str | None = None
    timeout_seconds: float = 30.0
    headers: Mapping[str, str] | None = None
    ws_endpoint: str | None = None


def to_websocket_endpoint(http_endpoint: str) -> str:
    if http_endpoint.startswith("https://"):
        return http_endpoint.replace("https://", "wss://", 1)
    if http_endpoint.startswith("http://"):
        return http_endpoint.replace("http://", "ws://", 1)
    return http_endpoint


class MoltisGraphQLClient:
    def __init__(self, options: MoltisClientOptions) -> None:
        self._endpoint = options.endpoint
        self._ws_endpoint = options.ws_endpoint or to_websocket_endpoint(options.endpoint)
        self._timeout = options.timeout_seconds

        headers: dict[str, str] = {}
        if options.api_key:
            headers["Authorization"] = f"Bearer {options.api_key}"
        if options.headers:
            headers.update(options.headers)

        self._headers = headers

    async def execute(self, query: str, variables: JsonMap | None = None) -> JsonMap:
        payload: dict[str, Any] = {"query": query}
        if variables is not None:
            payload["variables"] = dict(variables)

        try:
            async with httpx.AsyncClient(timeout=self._timeout, headers=self._headers) as client:
                response = await client.post(self._endpoint, json=payload)
        except httpx.HTTPError as exc:
            raise TransportError(str(exc)) from exc

        self._raise_http_errors(response)

        body = response.json()
        errors = body.get("errors")
        if isinstance(errors, list) and errors:
            messages = [str(entry.get("message", "GraphQL request failed")) for entry in errors]
            raise GraphQLResponseError(messages)

        data = body.get("data")
        if not isinstance(data, Mapping):
            raise TransportError("GraphQL response did not contain an object data payload")

        return data

    async def subscribe(
        self,
        query: str,
        variables: JsonMap | None = None,
    ) -> AsyncGenerator[JsonMap, None]:
        subscribe_id = str(uuid.uuid4())
        payload: dict[str, Any] = {"query": query}
        if variables is not None:
            payload["variables"] = dict(variables)

        extra_headers = self._headers if self._headers else None

        async with connect(
            self._ws_endpoint,
            subprotocols=[Subprotocol("graphql-transport-ws")],
            additional_headers=extra_headers,
        ) as websocket:
            await websocket.send(json.dumps({"type": "connection_init"}))
            await websocket.send(
                json.dumps(
                    {
                        "id": subscribe_id,
                        "type": "subscribe",
                        "payload": payload,
                    }
                )
            )

            async for message_text in websocket:
                frame = json.loads(message_text)
                frame_type = frame.get("type")

                if frame_type == "next":
                    next_payload = frame.get("payload", {})
                    errors = next_payload.get("errors")
                    if isinstance(errors, list) and errors:
                        messages = [
                            str(entry.get("message", "GraphQL subscription failed"))
                            for entry in errors
                        ]
                        raise GraphQLResponseError(messages)

                    data = next_payload.get("data")
                    if isinstance(data, Mapping):
                        yield data
                    continue

                if frame_type == "error":
                    raise GraphQLResponseError(["Subscription error"])  # protocol-level

                if frame_type == "complete":
                    break

    @staticmethod
    def _raise_http_errors(response: httpx.Response) -> None:
        if response.status_code in {401, 403}:
            raise AuthError(response.text)

        if response.status_code == 503:
            raise DisabledError(response.text)

        if response.status_code >= 400:
            raise TransportError(f"HTTP {response.status_code}: {response.text}")


def normalize_error(error: Exception) -> MoltisSdkError:
    if isinstance(error, MoltisSdkError):
        return error
    return TransportError(str(error))
