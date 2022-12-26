const core = require('@actions/core');
const github = require('@actions/github');
const http = require('@actions/http-client')
async function run() {
    try {
        // `who-to-greet` input defined in action metadata file
        const uid = core.getInput('uid', {required: true})
        const pack = core.getInput('pack', {required: true})
        const version = core.getInput('version', {required: true});
        const datapack = core.getInput('datapack', {required: true});
        const resourcepack = core.getInput('resourcepack');
        const supports = core.getMultilineInput('supports', {required: true});
        const dependencies = core.getMultilineInput('dependencies');
        const token = core.getInput('token', {required: true});
    
        const client = new http.HttpClient()
        const response = await client.post(`https://api.smithed.dev/addUserPackVersion?uid=${uid}&pack=${pack}&version=${version}&token=${token}`, JSON.stringify({
            data: {
                name: version,
                breaking: true,
                downloads: {
                    datapack: datapack,
                    resourcepack: resourcepack
                },
                supports: [supports],
                dependencies: [dependencies !== undefined ? dependencies.map(d => {const [pack, version] = d.split('@'); return {id: pack, version: version};}) : []]
            }
        }))

        const statusCode = response.message.statusCode
        if(statusCode !== 200)
            core.setFailed(response.message.statusMessage)
    } catch (error) {
        core.setFailed(error.message);
    }
}

run()
