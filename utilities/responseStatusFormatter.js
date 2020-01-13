"use strict";

exports.payoutResponseStatus = responseCode => {
  switch (responseCode) {
    case "3":
      return 'Cash withdrawal';
    case "4":
      return 'Withdrawal completed';
    case "5":
      return 'Withdrawal all success';
    case "6":
      return 'Withdrawal partly success';
    case "7":
      return 'Withdrawal all fail';
    case "8":
      return 'Auditing';
    case "9":
      return 'Reject';
  }
};