

export class Backend {
    constructor(host, port) {
        this.host = host;
        this.port = port;
    }
    getUrl(relative_path) {
        return `http://${this.host}:${this.port}/${relative_path}`;
    }
}
