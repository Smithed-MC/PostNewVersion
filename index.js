import fetch from 'node-fetch'
import core from '@actions/core';
import github from '@actions/github';

async function run() {
    try {
        // `who-to-greet` input defined in action metadata file
        const uid = core.getInput('uid', { required: true })
        const pack = core.getInput('pack', { required: true })
        const version = core.getInput('version', { required: true });
        const datapack = core.getInput('datapack', { required: true });
        const resourcepack = core.getInput('resourcepack');
        const supports = core.getMultilineInput('supports', { required: true });
        const dependencies = core.getMultilineInput('dependencies');
        const token = core.getInput('token', { required: true });

        const downloads = {
            datapack: datapack
        }
        if(resourcepack !== undefined && resourcepack !== '')
            downloads['resourcepack'] = resourcepack

        const response = await fetch(`https://api.smithed.dev/addUserPackVersion?uid=${uid}&pack=${pack}&version=${version}&token=${token}`, {
            method: 'POST', headers: { "Content-Type": "application/json" }, body: JSON.stringify({
                data: {
                    name: version,
                    breaking: true,
                    downloads: downloads,
                    supports: [supports],
                    dependencies: [dependencies !== undefined ? dependencies.map(d => { const [pack, version] = d.split('@'); return { id: pack, version: version }; }) : []]
                }
            })
        })

        if (!response.ok)
            return core.setFailed(await response.text())
        console.log(await response.text())
    } catch (error) {
        core.setFailed(error.message);
    }
}

run()
