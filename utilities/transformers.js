/**  
* const transformedFields = transformer({fields: {}, mapper: {}, opts: [-n, -s]})
*
* fields    = Fields which require transformation
* mapper    = Mapper is used to transform provided fields
* opts      = Options to trigger specific operation         
* -n or -N  = -n pr -N is an option to remove null values from an object
* -s or -S  = -s pr -S is an option to sort an object.
**/

exports.transformer = (args) => {

    let isSorting = false;
    let isRemoveNull = false;

    let fields = args.fields;
    let mapper = args.mapper;
    let opts = args.opts;
    let transformedFields = {};

    while (opts.length > 0) {
        option = opts[0];
        opts.splice(0, 1);
        switch (option.toLowerCase()) {
            case "-n":
                isRemoveNull = true;
                break
            case "-s":
                isSorting = true;
                break
            default:
                return "Unrecognised option";
        }
    }

    Object.entries(fields).map(([key, value]) => {
        const property = Object.getOwnPropertyDescriptor(mapper, key);
        if (property) {
            transformedFields[property.value] = value;
        }
    });

    if (isRemoveNull) {
        Object.entries(transformedFields).map(([key, value], index) => {
            if (!value) {
                delete transformedFields[key]
            }
        })
    }
    if (isSorting) {
        let sortedFields = {};
        const ascendingOrder = Object.keys(transformedFields).sort();
        Object.entries(transformedFields).map(([key, value], index) => {
            const property = Object.getOwnPropertyDescriptor(transformedFields, ascendingOrder[index]);
            if (property) {
                sortedFields[ascendingOrder[index]] = property.value;
            }
        });
        transformedFields = sortedFields;
    }

    return transformedFields;

};
