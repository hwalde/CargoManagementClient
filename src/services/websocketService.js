// src/services/websocketService.js
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
    constructor() {
        this.client = null;
        this.subscriptions = new Map();
    }

    connect() {
        if (this.client) {
            return;
        }

        this.client = new Client({
            // Verwenden Sie den relativen Pfad für den WebSocket-Endpunkt
            webSocketFactory: () => new SockJS('/ws'), // /ws wird über den Proxy weitergeleitet
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            debug: (str) => {
                console.log(str);
            },
            onConnect: () => {
                console.log('WebSocket verbunden');
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Details: ' + frame.body);
            },
        });

        this.client.activate();
    }

    subscribe(topic, callback) {
        if (this.client && this.client.connected) {
            const subscription = this.client.subscribe(topic, callback);
            this.subscriptions.set(topic, subscription);
        } else {
            this.client.onConnect = () => {
                const subscription = this.client.subscribe(topic, callback);
                this.subscriptions.set(topic, subscription);
            };
        }
    }

    unsubscribe(topic) {
        const subscription = this.subscriptions.get(topic);
        if (subscription) {
            subscription.unsubscribe();
            this.subscriptions.delete(topic);
        }
    }

    disconnect() {
        if (this.client) {
            this.client.deactivate();
            this.subscriptions.clear();
        }
    }
}

const webSocketService = new WebSocketService();
export default webSocketService;
