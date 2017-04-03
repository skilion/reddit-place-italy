# Reddit Place Italia
Questo programma ha coordinato gli sforzi di [/r/italy](https://www.reddit.com/r/italy/) su [/r/place](https://www.reddit.com/r/place/) ([wikipedia](https://en.wikipedia.org/wiki/Reddit#Place)) il 2017-04-02 e il 2017-04-03 tramite il seguente [fork](https://github.com/theitalyplace/reddit-place-italy).

## Risultato del 2017-04-02
![Screen1](/results/1.png)![Screen2](/results/2.png)![Screen3](/results/3.png)![Screen4](/results/4.png)![Screen5](/results/5.png)

## Installazione - Windows
1. Installare [Node.js](https://nodejs.org/it/)
2. Scaricare ed estrarre [reddit-place-italy](https://github.com/skilion/reddit-place-italy/archive/master.zip)
3. Aprire il prompt comandi nella cartella scaricata
	- Con Windows 10: SHIFT + tasto destro del mouse sulla cartella, "Apri finestra di comando qui"
	- Con gli altri bisogna navigare [manualmente](http://it.wikihow.com/Cambiare-Directory-dal-Prompt-dei-Comandi)
4. Eseguire dal prompt comandi `npm install`

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
Eseguire `node board.js`, la board viene salvata in `board.png`.

[Link alla board finale](board.png)

## Changelog

2017-04-02 23:10 CET
* Corretto bug per cui multipli account correggono contemporaneamente lo stesso pixel

2017-04-02 22:05 CET
* Gestione di utenti multipli

2017-04-02 17:30 CET
* Prima versione