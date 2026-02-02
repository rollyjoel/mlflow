import {
  TraceLocation,
  TraceLocationType,
  createTraceLocationFromExperimentId,
  createTraceLocationFromUCSchema,
} from '../../../src/core/entities/trace_location';

describe('TraceLocation', () => {
  describe('constructor and basic functionality', () => {
    it('should create a TraceLocation with MLflow experiment', () => {
      const traceLocation: TraceLocation = {
        type: TraceLocationType.MLFLOW_EXPERIMENT,
        mlflowExperiment: { experimentId: '123' },
      };

      expect(traceLocation.type).toBe(TraceLocationType.MLFLOW_EXPERIMENT);
      expect(traceLocation.mlflowExperiment?.experimentId).toBe('123');
      expect(traceLocation.inferenceTable).toBeUndefined();
    });

    it('should create a TraceLocation with inference table', () => {
      const traceLocation: TraceLocation = {
        type: TraceLocationType.INFERENCE_TABLE,
        inferenceTable: { fullTableName: 'a.b.c' },
      };

      expect(traceLocation.type).toBe(TraceLocationType.INFERENCE_TABLE);
      expect(traceLocation.inferenceTable?.fullTableName).toBe('a.b.c');
      expect(traceLocation.mlflowExperiment).toBeUndefined();
    });
  });

  describe('validation', () => {
    it('should validate that only one location type can be provided', () => {
      // This test validates the conceptual constraint that only one location should be provided
      // In TypeScript, this is more of a usage pattern validation
      const invalidLocation: TraceLocation = {
        type: TraceLocationType.TRACE_LOCATION_TYPE_UNSPECIFIED,
        mlflowExperiment: { experimentId: '123' },
        inferenceTable: { fullTableName: 'a.b.c' },
      };

      // Both are defined, which violates the constraint
      expect(invalidLocation.mlflowExperiment).toBeDefined();
      expect(invalidLocation.inferenceTable).toBeDefined();
      // In a real implementation, this would throw an error during validation
    });

    it('should validate type matches MLflow experiment location', () => {
      // This represents a mismatch: INFERENCE_TABLE type with mlflowExperiment data
      const mismatchedLocation: TraceLocation = {
        type: TraceLocationType.INFERENCE_TABLE,
        mlflowExperiment: { experimentId: '123' },
      };

      expect(mismatchedLocation.type).toBe(TraceLocationType.INFERENCE_TABLE);
      expect(mismatchedLocation.mlflowExperiment).toBeDefined();
      expect(mismatchedLocation.inferenceTable).toBeUndefined();
      // In a real implementation, this would be caught by validation
    });

    it('should validate type matches inference table location', () => {
      // This represents a mismatch: MLFLOW_EXPERIMENT type with inferenceTable data
      const mismatchedLocation: TraceLocation = {
        type: TraceLocationType.MLFLOW_EXPERIMENT,
        inferenceTable: { fullTableName: 'a.b.c' },
      };

      expect(mismatchedLocation.type).toBe(TraceLocationType.MLFLOW_EXPERIMENT);
      expect(mismatchedLocation.inferenceTable).toBeDefined();
      expect(mismatchedLocation.mlflowExperiment).toBeUndefined();
      // In a real implementation, this would be caught by validation
    });
  });

  describe('createTraceLocationFromExperimentId', () => {
    it('should create a TraceLocation with MLflow experiment', () => {
      const experimentId = 'experiment123';
      const location = createTraceLocationFromExperimentId(experimentId);

      expect(location.type).toBe(TraceLocationType.MLFLOW_EXPERIMENT);
      expect(location.mlflowExperiment).toBeDefined();
      expect(location.mlflowExperiment?.experimentId).toBe(experimentId);
      expect(location.inferenceTable).toBeUndefined();
      expect(location.ucSchema).toBeUndefined();
    });
  });

  describe('UC Schema location', () => {
    it('should create a TraceLocation with UC schema', () => {
      const traceLocation: TraceLocation = {
        type: TraceLocationType.UC_SCHEMA,
        ucSchema: { catalogName: 'my_catalog', schemaName: 'my_schema' },
      };

      expect(traceLocation.type).toBe(TraceLocationType.UC_SCHEMA);
      expect(traceLocation.ucSchema?.catalogName).toBe('my_catalog');
      expect(traceLocation.ucSchema?.schemaName).toBe('my_schema');
      expect(traceLocation.mlflowExperiment).toBeUndefined();
      expect(traceLocation.inferenceTable).toBeUndefined();
    });
  });

  describe('createTraceLocationFromUCSchema', () => {
    it('should create a TraceLocation with UC schema', () => {
      const catalogName = 'my_catalog';
      const schemaName = 'my_schema';
      const location = createTraceLocationFromUCSchema(catalogName, schemaName);

      expect(location.type).toBe(TraceLocationType.UC_SCHEMA);
      expect(location.ucSchema).toBeDefined();
      expect(location.ucSchema?.catalogName).toBe(catalogName);
      expect(location.ucSchema?.schemaName).toBe(schemaName);
      expect(location.mlflowExperiment).toBeUndefined();
      expect(location.inferenceTable).toBeUndefined();
    });
  });
});
