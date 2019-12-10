export class FakeValueObject {
  constructor(a, b) {
    this.__a = a
    this.__b = b
  }

  a() {
    return this.__a
  }

  b() {
    return this.__b
  }
}

export class FakeValueObjectBuilder {
  constructor() {
    this.__a = null
    this.__b = null
  }

  /**
   *
   * @param {FakeValueObject} instance
   * @return {FakeValueObjectBuilder}
   */
  static from(instance) {
    return new FakeValueObjectBuilder()
      .a(instance.a())
      .b(instance.b())
  }

  /**
   *
   * @param a
   * @return {FakeValueObjectBuilder}
   */
  a(a) {
    this.__a = a
    return this
  }

  /**
   *
   * @param b
   * @return {FakeValueObjectBuilder}
   */
  b(b) {
    this.__b = b
    return this
  }

  /**
   *
   * @return {FakeValueObject}
   */
  build() {
    return new FakeValueObject(this.__a, this.__b)
  }
}
