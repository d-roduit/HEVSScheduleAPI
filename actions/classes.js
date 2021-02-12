const list = (req, res) => {
    try {
        const indexPageDocument = res.locals.indexPageDocument;

        const classesSelectElement = indexPageDocument.getElementById('DropDownListClasse');

        let classes = [];

        for (const option of classesSelectElement.children) {
            classes.push({
                value: option.value,
                text: option.text
            });
        }

        return res.status(200).json(classes);
    } catch (err) {
        // TODO: Log error
        return res.status(500).json({ message: err.message });
    }
};

module.exports = { list };
