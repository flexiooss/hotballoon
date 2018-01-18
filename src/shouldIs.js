export const shouldIs = function(condition, format, ...formatArgs) {
  if (format === undefined) {
    throw new Error('`shouldIs` function require an error format argument')
  }
  condition = (typeof condition === 'function') ? condition() : condition
  if (!condition) {
    var error
    var ArgIndex = 0
    error = new Error(
      format.replace(/%s/g, () =>
        formatArgs[ArgIndex++]
      )
    )
    error.name = 'HOTBALLOON_ERROR:shouldIs'
    throw error
  }
}
