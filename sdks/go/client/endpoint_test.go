package client

import "testing"

func TestToWebSocketEndpointHTTP(t *testing.T) {
	got := ToWebSocketEndpoint("http://localhost:13131/graphql")
	if got != "ws://localhost:13131/graphql" {
		t.Fatalf("unexpected endpoint: %s", got)
	}
}

func TestToWebSocketEndpointHTTPS(t *testing.T) {
	got := ToWebSocketEndpoint("https://moltis.example.com/graphql")
	if got != "wss://moltis.example.com/graphql" {
		t.Fatalf("unexpected endpoint: %s", got)
	}
}
