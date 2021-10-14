export var provider = window.ethereum;

export async function request(method, params) {
    return await provider.request({
        method: method,
        params: params
    });
};

export async function connect() {
    return request('eth_requestAccounts');
}
