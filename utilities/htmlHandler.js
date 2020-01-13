const cheerio = require('cheerio');

exports.htmlHandler = (html) => {
    const htmlObject = cheerio.load(html);
    const formObj = {};

    htmlObject('input[type="hidden"]').each((i, element) => {
        formObj[element.attribs.name] = element.attribs.value;
    });

    const actionURL = htmlObject('form')[0].attribs.action;
    const methodType = htmlObject('form')[0].attribs.method;
    return { formObj, actionURL, methodType };
}

exports.parseBankDetails = (html) => {
    const htmlObject = cheerio.load(html);
    const bankDetails = {};
    htmlObject('table tr').each((i, element) => {
        bankDetails[htmlObject(element.children[1]).text()] = htmlObject(element.children[3]).text();
    });
    return bankDetails;
}

exports.htmlErrorHandler = (html) => {
    const htmlObject = cheerio.load(html);
    if (htmlObject('.notice')[0]) {
        const errorMessage = htmlObject('.notice')[0].children[1].children[0].data;
        return errorMessage.slice(19);
    }
    return null;
}