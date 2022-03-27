export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly url: URL;
  public readonly responseHeaders: Headers;

  constructor(apiResponse: Response, message?: string) {
    const url = new URL(apiResponse.url);
    url.searchParams.delete("apiKey"); // Make sure we don't expose the key

    super(
      message ??
        `The API returned status ${apiResponse.status} ` +
          `for endpoint ${url.pathname}`,
    );

    this.statusCode = apiResponse.status;
    this.url = url;
    this.responseHeaders = apiResponse.headers;
  }
}
