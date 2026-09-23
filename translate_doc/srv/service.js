const cds = require('@sap/cds');
const mammoth = require('mammoth');

module.exports = cds.service.impl(async function () {

    const { Documents } = this.entities;

    /**
     * Utility: Split text into chunks (API limit safe)
     */
    function splitText(text, maxLength = 5000) {
        const chunks = [];
        for (let i = 0; i < text.length; i += maxLength) {
            chunks.push(text.substring(i, i + maxLength));
        }
        return chunks;
    }

    /**
     * Main Action
     */
    this.on('translateDocument', async (req) => {

        const { file, fileName, targetLang } = req.data;

        if (!file) {
            return req.error(400, 'File is required');
        }

        try {
            // 1. Extract text from DOCX
            const result = await mammoth.extractRawText({ buffer: file });
            const originalText = result.value;

            // 2. Connect to SAP Destination
            const translationAPI = await cds.connect.to('SAP_TRANSLATION_API');

            // 3. Split text (important for large docs)
            const chunks = splitText(originalText);

            let finalTranslatedText = '';

            // 4. Call SAP API for each chunk
            for (const chunk of chunks) {

                const response = await translationAPI.send({
                    method: 'POST',
                    path: '/translate', // adjust if your API differs
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: {
                        sourceLanguage: "en",
                        targetLanguage: targetLang,
                        text: chunk
                    }
                });

                finalTranslatedText +=
                    (response.translations?.[0]?.text || '') + '\n';
            }

            // 5. Save to DB
            const inserted = await INSERT.into(Documents).entries({
                ID: cds.utils.uuid(),
                fileName: fileName,
                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                content: file,
                translatedText: finalTranslatedText,
                targetLanguage: targetLang,
                createdAt: new Date()
            });

            // 6. Return translated text
            return finalTranslatedText;

        } catch (err) {
            console.error(err);
            req.error(500, 'Translation failed');
        }
    });

});