// PropTypes custom error handlers
export const propTypesMissingError = (props, propName, componentName) => `The prop \`${propName}\` is marked as required in \`${componentName}\`, but it's value is \`${props[propName]}\``;
export const propTypesTypeError = (props, propName, componentName, type) => `Invalid prop \`${propName}\` of type \`${typeof props[propName]}\` supplied to \`${componentName}\`, expected \`${type}\``;

// Require propName if targetProp exists
export const requireWhenPropExists = (targetProp, props, propName, componentName, expectedType) => {
  if (props[targetProp] !== undefined && props[propName] === undefined) {
    return new Error(`The prop \`${propName}\` in \`${componentName}\` must be required when \`${targetProp}\` exists.`);
  } else if (props[targetProp] === undefined && props[propName] !== undefined) {
    return new Error(`Unnecessary prop \`${propName}\` supplied to \`${componentName}\`. This is not needed if \`${targetProp}\` is undefined.`);
  } else if (typeof props[propName] !== expectedType) {
    return new Error(propTypesTypeError(props, propName, componentName, expectedType));
  }
};
