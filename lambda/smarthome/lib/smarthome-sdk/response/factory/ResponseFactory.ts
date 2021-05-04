import { isAcceptGrant } from "../../dispatcher/request/handler/payloads/AcceptGrantRequestPayload"
import { Request, RequestPayload } from '../../dispatcher/request/handler/Request'
import { AcceptGrantResponseBuilder } from "./AcceptGrantResponseBuilder"
import { ResponseBuilder } from "./ResponseBuilder"

/**
 * Provider for {@link ResponseBuilder}
 */
 export class ResponseFactory {
  static getResponseBuilder(request: Request<RequestPayload>): ResponseBuilder {
    //TODO: Implement as strategy

    if (isAcceptGrant(request)) {
      return new AcceptGrantResponseBuilder(request)
    }

    throw Error(`No response builder for request: ${JSON.stringify(request.directive.header)}`)
  }
}
