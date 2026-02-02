/**
 * Types of trace locations
 */
export enum TraceLocationType {
  /**
   * Unspecified trace location type
   */
  TRACE_LOCATION_TYPE_UNSPECIFIED = 'TRACE_LOCATION_TYPE_UNSPECIFIED',

  /**
   * Trace is stored in an MLflow experiment
   */
  MLFLOW_EXPERIMENT = 'MLFLOW_EXPERIMENT',

  /**
   * Trace is stored in a Databricks inference table
   */
  INFERENCE_TABLE = 'INFERENCE_TABLE',

  /**
   * Trace is stored in a Databricks Unity Catalog schema
   */
  UC_SCHEMA = 'UC_SCHEMA',
}

/**
 * Interface representing an MLflow experiment location
 */
export interface MlflowExperimentLocation {
  /**
   * The ID of the MLflow experiment where the trace is stored
   */
  experimentId: string;
}

/**
 * Interface representing a Databricks inference table location
 */
export interface InferenceTableLocation {
  /**
   * The fully qualified name of the inference table where the trace is stored
   */
  fullTableName: string;
}

/**
 * Interface representing a Databricks Unity Catalog schema location.
 * Use this to store traces in Unity Catalog, which enables distributed tracing
 * across multiple services when using Databricks.
 */
export interface UCSchemaLocation {
  /**
   * The name of the Unity Catalog catalog
   */
  catalogName: string;

  /**
   * The name of the Unity Catalog schema
   */
  schemaName: string;
}

/**
 * Interface representing the location where the trace is stored
 */
export interface TraceLocation {
  /**
   * The type of the trace location
   */
  type: TraceLocationType;

  /**
   * The MLflow experiment location
   * Set this when the location type is MLflow experiment
   */
  mlflowExperiment?: MlflowExperimentLocation;

  /**
   * The inference table location
   * Set this when the location type is Databricks Inference table
   */
  inferenceTable?: InferenceTableLocation;

  /**
   * The Unity Catalog schema location
   * Set this when the location type is UC_SCHEMA
   */
  ucSchema?: UCSchemaLocation;
}

/**
 * Create a TraceLocation from an experiment ID
 * @param experimentId The ID of the MLflow experiment
 */
export function createTraceLocationFromExperimentId(experimentId: string): TraceLocation {
  return {
    type: TraceLocationType.MLFLOW_EXPERIMENT,
    mlflowExperiment: {
      experimentId: experimentId,
    },
  };
}

/**
 * Create a TraceLocation from a Unity Catalog schema.
 * Use this when storing traces in Databricks Unity Catalog.
 *
 * @param catalogName The name of the Unity Catalog catalog
 * @param schemaName The name of the Unity Catalog schema
 *
 * @example
 * ```typescript
 * import { setDestination, createTraceLocationFromUCSchema } from 'mlflow-tracing';
 *
 * setDestination(createTraceLocationFromUCSchema('my_catalog', 'my_schema'));
 * ```
 */
export function createTraceLocationFromUCSchema(
  catalogName: string,
  schemaName: string,
): TraceLocation {
  return {
    type: TraceLocationType.UC_SCHEMA,
    ucSchema: {
      catalogName,
      schemaName,
    },
  };
}
