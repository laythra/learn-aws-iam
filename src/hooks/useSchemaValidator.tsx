import { useMemo } from 'react';

import Ajv, { ValidateFunction, JSONSchemaType, Schema } from 'ajv';

const ajv = new Ajv();

function useSchemaValidator<T>(schema: JSONSchemaType<T> | Schema): ValidateFunction<T> {
  return useMemo(() => {
    return ajv.compile(schema);
  }, [schema]);
}

export default useSchemaValidator;
