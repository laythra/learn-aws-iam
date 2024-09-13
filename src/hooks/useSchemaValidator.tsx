import { useMemo } from 'react';

import Ajv, { ValidateFunction, JSONSchemaType, Schema } from 'ajv';

import { IAMPolicyRoleCreationObjective } from '@/types';

const ajv = new Ajv();

function useSchemaValidator<T>(schema: JSONSchemaType<T> | Schema): ValidateFunction<T> {
  return useMemo(() => {
    return ajv.compile(schema);
  }, [schema]);
}

export function useMultipleSchemaValidators<T>(
  policyRoleObjectives: IAMPolicyRoleCreationObjective[]
): ValidateFunction<T>[] {
  return useMemo(() => {
    return policyRoleObjectives.map(objective => ajv.compile(objective.json_schema));
  }, [policyRoleObjectives]);
}

export default useSchemaValidator;
