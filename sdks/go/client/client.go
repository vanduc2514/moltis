package client

import (
	"context"
	"fmt"
	"net/http"

	"github.com/Khan/genqlient/graphql"
)

type Options struct {
	Endpoint   string
	APIKey     string
	HTTPClient *http.Client
	Headers    map[string]string
}

type Client struct {
	gql graphql.Client
}

func New(options Options) *Client {
	httpClient := options.HTTPClient
	if httpClient == nil {
		httpClient = &http.Client{}
	}

	headers := copyHeaders(options.Headers)
	if options.APIKey != "" {
		headers["Authorization"] = "Bearer " + options.APIKey
	}

	httpClient.Transport = withHeaders(httpClient.Transport, headers)

	return &Client{
		gql: graphql.NewClient(options.Endpoint, httpClient),
	}
}

func (c *Client) DoRaw(ctx context.Context, query string, variables map[string]any) (map[string]any, error) {
	request := &graphql.Request{
		Query:     query,
		Variables: variables,
	}

	response := &graphql.Response{}
	if err := c.gql.MakeRequest(ctx, request, response); err != nil {
		return nil, err
	}

	payload, ok := response.Data.(map[string]any)
	if !ok {
		return nil, fmt.Errorf("unexpected GraphQL response payload type: %T", response.Data)
	}

	return payload, nil
}

func copyHeaders(headers map[string]string) map[string]string {
	copied := map[string]string{}
	for key, value := range headers {
		copied[key] = value
	}
	return copied
}
