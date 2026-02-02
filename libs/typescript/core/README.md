# MLflow Typescript SDK - Core

This is the core package of the [MLflow Typescript SDK](https://github.com/mlflow/mlflow/tree/main/libs/typescript). It is a skinny package that includes the core tracing functionality and manual instrumentation.

| Package              | NPM                                                                                                                           | Description                                                |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| [mlflow-tracing](./) | [![npm package](https://img.shields.io/npm/v/mlflow-tracing?style=flat-square)](https://www.npmjs.com/package/mlflow-tracing) | The core tracing functionality and manual instrumentation. |

## Installation

```bash
npm install mlflow-tracing
```

## Quickstart

Start MLflow Tracking Server. If you have a local Python environment, you can run the following command:

```bash
pip install mlflow
mlflow server --backend-store-uri sqlite:///mlruns.db --port 5000
```

If you don't have Python environment locally, MLflow also supports Docker deployment or managed services. See [Self-Hosting Guide](https://mlflow.org/docs/latest/self-hosting/index.html) for getting started.

Instantiate MLflow SDK in your application:

```typescript
import * as mlflow from 'mlflow-tracing';

mlflow.init({
  trackingUri: 'http://localhost:5000',
  experimentId: '<experiment-id>',
});
```

Create a trace:

```typescript
// Wrap a function with mlflow.trace to generate a span when the function is called.
// MLflow will automatically record the function name, arguments, return value,
// latency, and exception information to the span.
const getWeather = mlflow.trace(
  (city: string) => {
    return `The weather in ${city} is sunny`;
  },
  // Pass options to set span name. See https://mlflow.org/docs/latest/genai/tracing/quickstart
  // for the full list of options.
  { name: 'get-weather' },
);
getWeather('San Francisco');

// Alternatively, start and end span manually
const span = mlflow.startSpan({ name: 'my-span' });
span.end();
```

## Setting Trace Destination

By default, traces are stored in the MLflow experiment specified by `experimentId` in `init()`. You can override this by setting a custom destination using `setDestination()`.

### Unity Catalog Destination (Databricks)

When using Databricks, you can store traces in Unity Catalog. This is required for distributed tracing to work properly with Databricks.

```typescript
import * as mlflow from 'mlflow-tracing';

mlflow.init({
  trackingUri: 'databricks',
  experimentId: '123456789',
});

// Set destination to Unity Catalog for distributed tracing support
mlflow.setDestination(
  mlflow.createTraceLocationFromUCSchema('my_catalog', 'my_schema')
);
```

### MLflow Experiment Destination

You can also override the experiment destination:

```typescript
import * as mlflow from 'mlflow-tracing';

// Override the default experiment
mlflow.setDestination(
  mlflow.createTraceLocationFromExperimentId('different-experiment-id')
);
```

## Distributed Tracing

When your application spans multiple services, you can connect spans from these services into a single trace. MLflow supports this via **Distributed Tracing**, propagating the active trace context over HTTP using the W3C TraceContext specification.

**Note:** When using Databricks, distributed tracing requires Unity Catalog as the trace destination. Use `setDestination()` with `createTraceLocationFromUCSchema()` to enable this.

### Client Example

```typescript
import * as mlflow from 'mlflow-tracing';

mlflow.withSpan(async (span) => {
  // Get headers containing the trace context
  const headers = mlflow.getTracingContextHeadersForHttpRequest();

  // Pass headers to downstream service
  await fetch('https://your.service/handle', {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: 'hello' }),
  });
}, { name: 'client-root' });
```

### Server Handler Example (Express)

```typescript
import * as mlflow from 'mlflow-tracing';
import express from 'express';

const app = express();

app.post('/handle', (req, res) => {
  // Extract trace context from incoming headers
  mlflow.withTracingContextFromHeaders(req.headers, () => {
    mlflow.withSpan((span) => {
      // This span is a child of the client's span
      span.setAttribute('status', 'ok');
      res.json({ ok: true });
    }, { name: 'server-handler' });
  });
});
```

For async handlers, use `withTracingContextFromHeadersAsync`:

```typescript
app.post('/handle', async (req, res) => {
  await mlflow.withTracingContextFromHeadersAsync(req.headers, async () => {
    await mlflow.withSpan(async (span) => {
      // Async processing here
      res.json({ ok: true });
    }, { name: 'server-handler' });
  });
});
```

## Documentation 📘

Official documentation for MLflow Typescript SDK can be found [here](https://mlflow.org/docs/latest/genai/tracing/quickstart).

## License

This project is licensed under the [Apache License 2.0](https://github.com/mlflow/mlflow/blob/master/LICENSE.txt).
