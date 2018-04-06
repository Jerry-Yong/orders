
import { Injectable } from '@angular/core';

const url = 'https://www.bing.com/api/maps/mapcontrol?callback=__onBingLoaded&branch=release';

@Injectable()
export class BingMapsLoader {
    private static promise;
    public static load() {
        // First time 'load' is called?
        if (!BingMapsLoader.promise) {
            // Make promise to load
            BingMapsLoader.promise = new Promise(resolve => {
                // Set callback for when bing maps is loaded.
                window['__onBingLoaded'] = (ev) => {
                    resolve('Bing Maps API loaded');
                };
                const node = document.createElement('script');
                node.src = url;
                node.type = 'text/javascript';
                node.async = true;
                node.defer = true;
                document.getElementsByTagName('head')[0].appendChild(node);
            });
        }
        // Always return promise. When 'load' is called many times, the promise is already resolved.
        return BingMapsLoader.promise;
    }
}
