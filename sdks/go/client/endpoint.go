package client

import "strings"

func ToWebSocketEndpoint(httpEndpoint string) string {
	if strings.HasPrefix(httpEndpoint, "https://") {
		return strings.Replace(httpEndpoint, "https://", "wss://", 1)
	}

	if strings.HasPrefix(httpEndpoint, "http://") {
		return strings.Replace(httpEndpoint, "http://", "ws://", 1)
	}

	return httpEndpoint
}
