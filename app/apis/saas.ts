import { API_SAAS } from "../constants/apisPath";
const Axios = require('axios');

export async function getSaasToken() {

    return await new Promise((resolve, reject) => {
        Axios({
            method: 'POST',
            url: API_SAAS.tokenPath,
            data: {
                username: 'fmg',
                password: 4501937
            }
        }).then((response) => {
            if (response.status == 200) {
                resolve(response.data);
            } else {
                reject();
            }
            
        }).catch((e) => {
            reject(e);
            alert(e.toString());
        });
    })
};
