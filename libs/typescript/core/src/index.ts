import { init, setDestination, getDestination, resetDestination } from './core/config';
import {
  getLastActiveTraceId,
  getCurrentActiveSpan,
  updateCurrentTrace,
  startSpan,
  trace,
  withSpan,
} from './core/api';
import { flushTraces } from './core/provider';
import { MlflowClient } from './clients';
import {
  getTracingContextHeadersForHttpRequest,
  withTracingContextFromHeaders,
  withTracingContextFromHeadersAsync,
} from './core/distributed';
import {
  createTraceLocationFromExperimentId,
  createTraceLocationFromUCSchema,
  TraceLocationType,
} from './core/entities/trace_location';

export {
  getLastActiveTraceId,
  getCurrentActiveSpan,
  updateCurrentTrace,
  flushTraces,
  init,
  startSpan,
  trace,
  withSpan,
  MlflowClient,
  // Destination management
  setDestination,
  getDestination,
  resetDestination,
  createTraceLocationFromExperimentId,
  createTraceLocationFromUCSchema,
  TraceLocationType,
  // Distributed tracing
  getTracingContextHeadersForHttpRequest,
  withTracingContextFromHeaders,
  withTracingContextFromHeadersAsync,
};

// Export entities
export * from './core/constants';
export type { LiveSpan, Span } from './core/entities/span';
export type { Trace } from './core/entities/trace';
export type { TraceInfo, TokenUsage } from './core/entities/trace_info';
export type { TraceData } from './core/entities/trace_data';
export { SpanStatusCode } from './core/entities/span_status';
export type { UpdateCurrentTraceOptions, SpanOptions, TraceOptions } from './core/api';
export { registerOnSpanStartHook, registerOnSpanEndHook } from './exporters/span_processor_hooks';

// Export trace location types
export type {
  TraceLocation,
  MlflowExperimentLocation,
  UCSchemaLocation,
  InferenceTableLocation,
} from './core/entities/trace_location';
