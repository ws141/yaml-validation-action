const core = require('@actions/core');
const fs = require('fs');
const yaml = require('js-yaml');
const fetch = require('node-fetch');

const escapeNewline = (string) => {
    return string
        .replace(/%/g, "%25")
        .replace(/\r/g, "%0D")
        .replace(/\n/g, "%0A");
};

(async () => {
    try {
        const apiEndpoint = core.getInput('api-endpoint');
        const yamlFile = core.getInput('yaml-file');
        const basicAuthUser = core.getInput('basic-auth-user');
        const basicAuthPassword = core.getInput('basic-auth-password');

        var headers = { "Content-Type": "application/json" };
        if (basicAuthUser && basicAuthPassword) {
            encodedCreds = Buffer.from(`${basicAuthUser}:${basicAuthPassword}`).toString('base64');
            headers = { ...headers, "Authorization": `Basic ${encodedCreds}`};
        }
        
        const convertedFile = yaml.load(fs.readFileSync(yamlFile, 'utf8'));
        console.log('YAML converted to JSON:');
        console.log(convertedFile);
        
        const response = await fetch(apiEndpoint, {
            method: "post",
            body: JSON.stringify(convertedFile),
            headers: headers,
        }).catch(error => { throw new Error(`Invalid request to server: ${error.message}`) });
        
        if (!response.ok) {
            // const errorText = await response.text();
            const errorText = response.statusText;
            throw new Error(`Invalid response from server: ${errorText}`);
        }
        
        const responseJson = await response.json();
        console.log('API response:')
        console.log(responseJson);

        if (responseJson.response.isValid) {
            console.log('Assignment YAML is valid')
        } else {
            const failMessage = `Invalid YAML definition:\n${responseJson.response.errors.join('\n')}`;
            core.setFailed(failMessage);
        }
    } catch (error) {
        core.setFailed(error.message);
    }
})();
