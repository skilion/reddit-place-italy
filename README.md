# Reddit Place Italia
Questo programma coordina gli sforzi di [/r/italy](https://www.reddit.com/r/italy/) su [/r/place](https://www.reddit.com/r/place/)

![reddit italy logo](r_italy_logo.png)

## Installazione - Windows
1. Installare [Node.js](https://nodejs.org/it/)
2. Scaricare ed estrarre [reddit-place-italy](https://github.com/skilion/reddit-place-italy/archive/master.zip)
3. Entrare con il prompt comandi nella cartella ed eseguire `npm install`

## Installazione - Linux
```
apt-get install nodejs
git clone git@github.com:skilion/reddit-place-italy.git
cd reddit-place-italy
npm install
```

## Configurazione
Rinominare `users.EMPTY.json` in `users.json`.
Aprire `users.json` con un editor di testo e inserire gli account di reddit disponibili con nome utente e password.

## Avvio
```
npm start
```

## Creare un'immagine della board
Eseguire `node board.js`, la board viene salvata in `board.png`

## Changelog

2017-04-02 17:30
* Prima versione