export const staticClassName = scope => scope.toString().split('(' || /s+/)[0].split(' ' || /s+/)[1]
