const list = (req, res) => {
    try {
        const indexPageDocument = res.locals.indexPageDocument;

        const classesSelectElement = indexPageDocument.getElementById('DropDownListClasse');

        const classesObject = {
            classes: []
        };

        for (const option of classesSelectElement.children) {
            classesObject.classes.push({
                value: option.value,
                text: option.text
            });
        }

        return res.status(200).json(classesObject);
    } catch (err) {
        // TODO: Log error
        return res.status(500).json({ message: err.message });
    }
};

export default { list };
