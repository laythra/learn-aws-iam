import Ajv, { ValidateFunction } from 'ajv';

const ajv = new Ajv();

export function compileSchema(schema: object): ValidateFunction {
  return ajv.compile(schema);
}
