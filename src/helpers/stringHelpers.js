export const firstUppercase = (word) => {
  let res = word.toLowerCase()
  return res[0].toUpperCase() + res.slice(1)
}
export const camelCase = (word, sep = '_', firstUpper = true) => {
  let words = word.split(sep)
  let res
  let i = 0
  let countOfWords = words.length
  if (!firstUpper) {
    res = word[0].toLowerCase()
    i = 1
  }
  for (i; i < countOfWords; i++) {
    res += firstUppercase(words[i])
  }
  return res
}
