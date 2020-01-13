"use strict";

const stringifySafe = require("./stringifySafe");

const errorResponseHandler = (ctx, err) => {
  const {
    status,
    title = null,
    errors = null,
    request = {},
    statusText = null,
    message = null
  } = err.response ? err.response : err;
  const instance =
    request && request.path !== undefined ? request.path : ctx.request.url;
  let errorTitle;

  const data =
    err && err.response && err.response.data
      ? err.response.data.data
        ? err.response.data.data
        : err.response.data
      : err.data;
  // data.status ? delete data.status : null;
  // data.message ? delete data.message : null;

  switch (status) {
    case 400:
      ctx.log.error(stringifySafe(err, null, 2));
      ctx.response.badRequest({ title: message, instance, ...data }, message);
      break;
    case 401:
      ctx.log.fatal(stringifySafe(err, null, 2));
      ctx.response.unauthorized(
        {
          title: title || statusText || message || "Authentication Failed",
          instance
        },
        message
      );
      break;
    case 404:
      ctx.log.error(stringifySafe(err, null, 2));
      ctx.response.notFound(
        {
          title: title || statusText || message,
          instance,
          ...data
        },
        "Resource not found"
      );
      break;
    case 409:
      ctx.log.error(stringifySafe(err, null, 2));
      ctx.response.conflict(null, {
        title: title || statusText || message,
        instance
      });
      break;
    case 503:
      errorTitle =
        title ||
        statusText ||
        message ||
        (err.source !== undefined
          ? `${err.source} unavailable`
          : "Service unavailable");
      ctx.log.error(stringifySafe(err, null, 2));
      ctx.response.serviceUnavailable(null, {
        title: errorTitle,
        instance
      });
      break;
    default:
      errorTitle =
        title ||
        statusText ||
        message ||
        (err.source !== undefined
          ? `${err.source} Internal Error`
          : "Internal Error");
      ctx.log.error(stringifySafe(err, null, 2));
      ctx.response.internalServerError(status, {
        title: errorTitle,
        instance
      });
  }
};

module.exports = errorResponseHandler;
