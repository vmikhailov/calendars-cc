import { InjectionToken } from '@angular/core';
import { environment } from 'src/environments/environment';


export interface ApiEndpointConfig {
    host?: string;
    port?: number;
    root: string;
    paths: {
        [key: string]: string;
    };
}

export interface ApiConfig {
    host: string,
    rules: ApiEndpointConfig;
    stats: ApiEndpointConfig;
    calendar: ApiEndpointConfig;
    settings: ApiEndpointConfig;
    getApiUrl(
        service: keyof Omit<ApiConfig, 'host' | 'getApiUrl'>,
        action: string,
        params?: Record<string, string | number>
    ): string;
}

export const DEFAULT_API_CONFIG: ApiConfig = {
    host: environment.apiRoot ?? '',
    rules: {
        root: '/api/rules',
        paths: {
            getAll: '',             // GET
            save: '',               // POST
            getCode: ':id/code',    // GET
            saveCode: ':id/code',   // PUT
            delete: ':id',          // DELETE
            enable: ':id/enable',   // POST
            disable: ':id/disable', // POST
            pause: ':id/pause',     // POST
        }
    },
    stats: {
        root: '/api/stats',
        paths: {
            getAll: '',             // GET
        }
    },

    calendar: {
        root: '/api/events',
        paths: {
            getAll: '',             // GET
        }
    },
    settings: {
        root: '/api/settings',
        paths: {
            get: '', // GET
            update: '', // PUT
        }
    },

    getApiUrl(service, action, params) {
        // @ts-ignore
        const endpoint: ApiEndpointConfig = this[service];
        let path = endpoint.paths[action];

        // Substitute params in the path, e.g. ':id' => params.id
        if (params) {
            Object.keys(params).forEach(key => {
                path = path.replace(`:${key}`, encodeURIComponent(params[key] + ''));
            });
        }

        let host = '';
        if (endpoint.host) {
            host = endpoint.host;
        }
        else {
            host = this.host || '';

            if (endpoint.port) {
                const colonIndex = host.lastIndexOf(':');
                const base = colonIndex !== -1 ? host.substring(0, colonIndex) : host;
                host = base + ':' + endpoint.port;
            }

            endpoint.host = host;
        }

        return host + endpoint.root + '/' + path;
    }
};

export const API_CONFIG = new InjectionToken<ApiConfig>('API_CONFIG');
