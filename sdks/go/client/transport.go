package client

import "net/http"

type headerTransport struct {
	headers map[string]string
	base    http.RoundTripper
}

func withHeaders(base http.RoundTripper, headers map[string]string) http.RoundTripper {
	if base == nil {
		base = http.DefaultTransport
	}

	return &headerTransport{base: base, headers: headers}
}

func (transport *headerTransport) RoundTrip(request *http.Request) (*http.Response, error) {
	cloned := request.Clone(request.Context())
	for key, value := range transport.headers {
		cloned.Header.Set(key, value)
	}
	return transport.base.RoundTrip(cloned)
}
