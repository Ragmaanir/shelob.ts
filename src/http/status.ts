
export enum StatusKind {
  INFO = 100,
  SUCCESS = 200,
  REDIRECT = 300,
  CLIENT_ERROR = 400,
  SERVER_ERROR = 500
}

export class HttpStatus {
  static NAMES = new Map<number, string>([
    [200, "OK"],
    [400, "Client Error"],
    [404, "Not Found"],
    [405, "Method Not Allowed"],
    [422, "Request could not be processed"],
    [500, "Server Error"]
  ])

  static from_code(code: number): HttpStatus {
    return new HttpStatus(code)
  }

  constructor(readonly code: number) { }

  get success(): boolean {
    return this.code >= 200 && this.code < 300
  }

  get name(): string {
    const name = HttpStatus.NAMES.get(this.code)

    if (name === undefined) {
      throw new Error(`Unknown http status code: ${this.code}`)
    }

    return name
  }

  get full_message() {
    return `(${this.code}) ${this.name}`
  }

  get kind() {
    const v = Math.floor(this.code / 100)

    switch (v) {
      case 1: return StatusKind.INFO
      case 2: return StatusKind.SUCCESS
      case 3: return StatusKind.REDIRECT
      case 4: return StatusKind.CLIENT_ERROR
      case 5: return StatusKind.SERVER_ERROR
      default: throw new Error(`Invalid http status code: ${this.code}`)
    }
  }

  // get kind() {
  //   const v = this.code

  //   if(v < 200)
  //     return StatusKind.INFO
  //   else if(v < 300)
  //     return StatusKind.SUCCESS
  //   else if (v < 400)
  //     return StatusKind.REDIRECT
  //   else if(v < 500)
  //     return StatusKind.CLIENT_ERROR
  //   else if(v < 600)
  //     return StatusKind.SERVER_ERROR
  //   else
  //     throw new Error(`Invalid http status code: ${v}`)
  // }

  get is_info() { return this.kind === StatusKind.INFO }
  get is_success() { return this.kind === StatusKind.SUCCESS }

  get is_error() { return this.is_client_error || this.is_server_error }
  get is_client_error() { return this.kind === StatusKind.CLIENT_ERROR }
  get is_server_error() { return this.kind === StatusKind.SERVER_ERROR }

  get is_unprocessable_entity() { return this.code === 422 }
  get is_validation_error() { return this.is_unprocessable_entity }
}


// export class HttpStatus {
//   constructor(readonly name: string, readonly code: number) { }
// }

export const HttpStatuses = {
  OK: new HttpStatus(200),
  NOT_FOUND: new HttpStatus(404),
  UNPROCESSABLE_ENTITY: new HttpStatus(422),
  METHOD_NOT_ALLOWED: new HttpStatus(405),
  INTERNAL_ERROR: new HttpStatus(500)
}
