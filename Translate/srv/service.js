const cds = require('@sap/cds');
 
module.exports = cds.service.impl(async function () {
 
    const api = await cds.connect.to('translate');
 
    this.on('translate', async (req) => {
        const { res,data } = req.data;
        try {
            // const course = await SELECT.from('Course');
            // const translateData = course
            //     .map(s => {
            //         const Name = s.Name ?? '';
            //         const Department = s.Department ?? '';
            //         return `[${Name} , ${Department}]`.trim();
            //     })
            // if (!translateData) {
            //     return req.error(400, "No valid data to translate");
            // }
 
            const result = await api.send({
                method: 'POST',
                path: `/api/v1/translation/?sourceLanguage=en-US&targetLanguage=${res}`,
                headers: {
                    'Content-Type': 'text/plain'
                },
                data: data
            });
 
            console.log("API response:", result);
           
            const output = Buffer.from(result.data, 'base64').toString('utf-8');
 
            return output;
        } catch (err) {
            console.error("Translation Error:", err);
            return err.message;
        }
    });
});
 