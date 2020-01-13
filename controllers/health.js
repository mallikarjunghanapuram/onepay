"use strict";

exports.check = ctx =>{
    ctx.response.ok({health: "ok"}, "Service is alive!")
}