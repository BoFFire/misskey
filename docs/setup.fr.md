Guide d'installation et de configuration de Misskey
================================================================

Nous vous remerçions de l'intérêt que vous exprimez pour installer votre propre serveur Misskey !
Ce guide décrit les étapes à suivre pour installer et configurer votre instance Misskey.

[La version en japonnais est aussi disponible sur 日本語版もあります](./setup.ja.md)

----------------------------------------------------------------

*1.* Créez u utilisateur Misskey
----------------------------------------------------------------
Running misskey on root is not a good idea so we create a user for that.
Sur Debian, à titre d'exemple :

```
adduser --disabled-password --disabled-login misskey
```

*2.* Installez les dépendances
----------------------------------------------------------------
Veuillez installer et configurer les logiciels suivants :

#### Dépendances :package:
* **[Node.js](https://nodejs.org/en/)** >= 10.0.0
* **[MongoDB](https://www.mongodb.com/)** >= 3.6

##### Optionnel
* [Redis](https://redis.io/)
  * Redis is optional, but we strongly recommended to install it
* [Elasticsearch](https://www.elastic.co/) - required to enable the search feature

*3.* Configuration de MongoDB
----------------------------------------------------------------
En mode root :
1. `mongo` Entrez dans le shell mango.
2. `use misskey` Utilisez la base de données misskey.
3. `db.users.save( {dummy:"dummy"} )` Write dummy data to initialize the db.
4. `db.createUser( { user: "misskey", pwd: "<password>", roles: [ { role: "readWrite", db: "misskey" } ] } )` Crée l'utilisateur misskey.
5. `exit` C'est tout, vous avez terminé !

*4.* Installez Misskey
----------------------------------------------------------------
1. `su - misskey` Connectez votre utilisateur misskey.
2. `git clone -b master git://github.com/syuilo/misskey.git` Clone la branche master du dépôt misskey.
3. `cd misskey` Accède au répértoire misskey.
4. `git checkout $(git tag -l | grep -v 'rc[0-9]*$' | sort -V | tail -n 1)` Checkout to the [latest release](https://github.com/syuilo/misskey/releases/latest)
5. `npm install` Installe les dépendances de Misskey.

*(optionnel)* Génération des clés VAPID
----------------------------------------------------------------
If you want to enable ServiceWorker, you need to generate VAPID keys:
Unless you have set your global node_modules location elsewhere, you need to run this in root.

``` shell
npm install web-push -g
web-push generate-vapid-keys
```

*5.* Make configuration file
----------------------------------------------------------------
1. `cp .config/example.yml .config/default.yml` Copy the `.config/example.yml` and rename it to `default.yml`.
2. Edit `default.yml`

*6.* Construction de Misskey
----------------------------------------------------------------

Build misskey with the following:

`npm run build`

If you're on Debian, you will need to install the `build-essential` package.

If you're still encountering errors about some modules, use node-gyp:

1. `npm install -g node-gyp`
2. `node-gyp configure`
3. `node-gyp build`
4. `npm run build`

*7.* That is it.
----------------------------------------------------------------
Excellent ! Maintenant, vous avez un environnement prêt à accueillir Misskey.

### Lancement conventionnel
Lancez `npm start`. Bonne chance, amusez-vous bien !

### Lancement à l'aide de systemd

1. Créez un service systemd ici : `/etc/systemd/system/misskey.service`
2. Editez le fichier de service puis copier/coller ce qui suit :

```
[Unit]
Description=Misskey daemon

[Service]
Type=simple
User=misskey
ExecStart=/usr/bin/npm start
WorkingDirectory=/home/misskey/misskey
TimeoutSec=60
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=misskey
Restart=always

[Install]
WantedBy=multi-user.target
```

3. `systemctl daemon-reload ; systemctl enable misskey` Reload systemd and enable the misskey service.
4. `systemctl start misskey` Start the misskey service.

You can check if the service is running with `systemctl status misskey`.

### Way to Update to latest version of your Misskey
1. `git fetch`
2. `git checkout $(git tag -l | grep -v 'rc[0-9]*$' | sort -V | tail -n 1)`
3. `npm install`
4. `npm run build`
5. Check [ChangeLog](../CHANGELOG.md) for migration information

----------------------------------------------------------------

Merci de nous contacter si vous rencontrez des difficultés ou avez besoin de poser des question !
