from moltis_sdk.client import to_websocket_endpoint


def test_to_websocket_endpoint_http() -> None:
    assert to_websocket_endpoint("http://localhost:13131/graphql") == "ws://localhost:13131/graphql"


def test_to_websocket_endpoint_https() -> None:
    assert (
        to_websocket_endpoint("https://moltis.example.com/graphql")
        == "wss://moltis.example.com/graphql"
    )
