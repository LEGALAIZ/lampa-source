import Manifest from './manifest'
import Request from './reguest'
import Storage from './storage'
import Plugins from './plugins'

/**
 * Короче, постоянно пишут (почему нет картинок?)
 * Решил сделать автоматическую установку TMDB Proxy если регион RU
 */
function init(){
    if(Storage.get('vpn_checked_ready', 'false') || Storage.get('tmdb_proxy_api', '') || Storage.get('tmdb_proxy_image', '')) return

    let network = new Request()

    let extract = (proto, call, error)=>{
        network.silent(proto + '://geo.' + Manifest.cub_domain,call,error,false,{
            dataType: 'text'
        })
    }

    let install = (country)=>{
        console.log('VPN', 'country ' + country)

        if(country.trim() == 'RU'){
            //ну это наш клиент

            let ready = Plugins.get().find(a=>(a.url + '').indexOf('plugin/tmdb-proxy') >= 0)

            if(!ready){
                console.log('VPN', 'install TMDB Proxy')

                Plugins.add({url: './plugins/tmdb_proxy.js', status: 1, name: 'TMDB Proxy LOCAL', author: '@lampa-LIGA'})
                Plugins.add({url: './vender/skaztv_store/skaztv_store.js', status: 1, name: 'skaztv_store LOCAL', author: '@lampa-LIGA'})
                Plugins.add({url: './plugins/scabrum_addons/scabrum_addon.js', status: 1, name: 'Scabrum_Addons LOCAL', author: '@lampa-LIGA'}
            }
        }
    }

    let installed = Plugins.get().find(a=>(a.url + '').indexOf('plugin/tmdb-proxy') >= 0)

    if(!installed){
        console.log('VPN', 'start install TMDB Proxy')

        extract('https', install,()=>{
            //может не работает https

            Storage.set('protocol', 'http')

            console.log('VPN', 'disable HTTPS')

            extract('http', install, ()=>{
                console.log('VPN', 'domain not responding')

                //хммм...., наверно к домену не подключается
            })
        })
    }

    Storage.set('vpn_checked_ready', true)
}

export default {
    init
}