const ruleExpressionMap = {
  gte: (value, expectedValue) => value >= expectedValue,
  gt: (value, expectedValue) => value > expectedValue,
  neq: (value, expectedValue) => value != expectedValue,
  eq: (value, expectedValue) => value == expectedValue,
  contains: (value, expectedValue) => value.includes(expectedValue),
};

const evaluateExpression = (value, expression, expected) => {
  const mappedExpr = ruleExpressionMap[expression];
  if (typeof mappedExpr === 'function') {
    return mappedExpr(value, expected);
  }
  throw new Error('validation expression handler not defined.');
};

const validateRule = ({ rule, value }) => {
  const { condition, condition_value } = rule;
  return evaluateExpression(value, condition, condition_value);
};

const queryNestedArrayField = (data, indexString) => {
  const [key, ...a] = indexString.split('[');
  const obj = key ? data[key] : data;

  return a.reduce((acc, field) => acc[Number(field.split(']')[0])], obj);
};

const queryNestedField = (nestedField, fields, shouldThrow) => {
  const fieldsToQuery = fields.split('.');

  if (fieldsToQuery.length > 2)
    throw new Error('Nesting cannot be more than 2 levels deep.');
  const queriedField = fieldsToQuery.reduce(
    (acc, field) =>
      field.includes('[') ? queryNestedArrayField(acc, field) : acc[field],
    nestedField
  );
  if (!queriedField && shouldThrow)
    throw new Error(`field ${fields} is missing from data.`);
  return queriedField;
};

const jsonValidation = ({ rule, data }) => {
  const { field } = rule;
  return validateRule({ rule, value: queryNestedField(data, field, true) });
};

const indexBasedValidation = ({ rule, data }) => {
  const { field } = rule;
  if (!Number(field) && Number(field) !== 0)
    throw new Error('Only an integer field is allowed when data is array.');

  const fieldValue = data[Number(field)];
  if (fieldValue === undefined)
    throw new Error(`field ${field} is missing from data.`);
  return validateRule({ rule, value: fieldValue });
};

const dataTypeValidationHandler = {
  string: indexBasedValidation,
  array: indexBasedValidation,
};

const dataValidations = ({ data, rule }) => {
  const handler =
    dataTypeValidationHandler[Array.isArray(data) ? 'array' : typeof data] ||
    jsonValidation;
  return handler({ data, rule });
};

export default dataValidations;
