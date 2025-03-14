import formidable from "formidable"

const upload = (options = {}) => {
    return (req, res, next) => {
        const form = formidable({
            // maxFileSize: 200 * 1024 * 1024, // 200MB
            // uploadDir: './uploads',
            // keepExtensions: true,
            ...options // Permite passar opções personalizadas
        });

        form.parse(req, (err, fields, files) => {
            if (err) {
                console.error('Erro no upload:', err);
                return res.status(400).json({ error: err.message });
            }

            const formattedFields = Object.fromEntries(
                Object.entries(fields).map(([key, value]) => [key, value.length === 1 ? value[0] : value])
            );
            req.body = formattedFields; // Adiciona os campos do formulário ao req.body
            req.files = files; // Adiciona os arquivos ao req.files
            next(); // Passa para o próximo middleware ou rota
        });
    };
};

export default upload;